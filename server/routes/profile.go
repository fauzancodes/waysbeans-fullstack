package routes

import (
	"waysbeans/handlers"
	"waysbeans/pkg/middleware"
	"waysbeans/pkg/mysql"
	"waysbeans/repositories"

	"github.com/labstack/echo/v4"
)

func ProfileRoutes(e *echo.Group) {
	profileRepository := repositories.RepositoryProfile(mysql.DB)
	h := handlers.HandlerProfile(profileRepository)

	e.GET("/profiles", h.FindProfiles)
	e.GET("/profile/:id", middleware.Auth(h.GetProfile))
	e.POST("/profile", middleware.Auth(middleware.UploadFile(h.CreateProfile)))
	e.PATCH("/profile/:id", middleware.Auth(middleware.UploadFile(h.UpdateProfile)))
	e.DELETE("/profile", middleware.Auth(h.DeleteProfile))
}
