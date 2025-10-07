package internal

import (
	"log"
	"math"
	"syscall"
	"time"
	"unsafe"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/mem"
)

var (
	TotalCPU    = make(chan float64, 10)
	CurrentCPU  float64
	TotalRAM    = make(chan float64, 10)
	CurrentRAM  float64
	TotalDisk   = make(chan float64, 10)
	CurrentDisk float64
)

func GetCPUStatus() {
	for {
		percentage, err := cpu.Percent(time.Second, false)
		if err != nil {
			log.Printf("error in reading total cpu usage percentage: %s\n", err.Error())
		} else {
			TotalCPU <- math.Round(percentage[0]*100) / 100
		}
		time.Sleep(5 * time.Second)
	}
}
func GetRAMStatus() {
	for {
		v, err := mem.VirtualMemory()
		if err == nil {
			TotalRAM <- math.Round(v.UsedPercent*100) / 100
		}
		time.Sleep(5 * time.Second)
	}
}
func GetDiskStatus() {
	for {
		kernel32 := syscall.MustLoadDLL("kernel32.dll")
		getDiskFreeSpaceEx := kernel32.MustFindProc("GetDiskFreeSpaceExW")

		var freeBytesAvailable, totalBytes, totalFreeBytes uint64
		getDiskFreeSpaceEx.Call(
			uintptr(unsafe.Pointer(syscall.StringToUTF16Ptr("c://"))),
			uintptr(unsafe.Pointer(&freeBytesAvailable)),
			uintptr(unsafe.Pointer(&totalBytes)),
			uintptr(unsafe.Pointer(&totalFreeBytes)),
		)
		TotalDisk <- math.Round(100*(100.0*(1.0-float64(freeBytesAvailable)/float64(totalBytes)))) / 100
		time.Sleep(5 * time.Second)
	}
}
func UpdateTotalSystemStats() {
	var newData float64
	go GetCPUStatus()
	go GetRAMStatus()
	go GetDiskStatus()
	for {
		select {
		case newData = <-TotalCPU:
			CurrentCPU = newData
		case newData = <-TotalRAM:
			CurrentRAM = newData
		case newData = <-TotalDisk:
			CurrentDisk = newData
		}
	}
}
