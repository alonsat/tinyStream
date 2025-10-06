package handlers

import (
	"net/http"

	"tinystream/internal"

	"github.com/gin-gonic/gin"
)

func Bit(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "OK",
		"totalCPU":  internal.CurrentCPU,
		"totalRAM":  internal.CurrentRAM,
		"totalDisk": internal.CurrentDisk,
	})
}
