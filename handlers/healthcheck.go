package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Bit(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
	})
}
