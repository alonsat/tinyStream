package httpServer

import (
	"net/http"
	"tinystream/handlers"

	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(corsMiddleware())
	api := r.Group("/api")
	initializeV1Endpoints(api)
	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"error": "route not found"})
	})
	return r
}
func initializeV1Endpoints(group *gin.RouterGroup) {
	v1 := group.Group("v1")
	initializeV1HealthChecks(v1)
	initializeV1UserRoutes(v1)
	initializeV1streaming(v1)
	return
}
func initializeV1HealthChecks(group *gin.RouterGroup) {
	healthChecks := group.Group("/healthcheck")
	healthChecks.GET("/bit", handlers.Bit)
	return
}
func initializeV1UserRoutes(group *gin.RouterGroup) {
	//TODO: user logic
	return
}
func initializeV1streaming(group *gin.RouterGroup) {
	//TODO: streaming logic
	return
}
