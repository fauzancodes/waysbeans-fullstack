package routes

import (
	"waysbeans/handlers"
	"waysbeans/pkg/middleware"
	"waysbeans/pkg/mysql"
	"waysbeans/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	profileRepository := repositories.RepositoryProfile(mysql.DB)
	cartRepository := repositories.RepositoryCart(mysql.DB)
	transactionRepository := repositories.RepositoryTransaction(mysql.DB)
	h := handlers.HandlerUser(userRepository, profileRepository, cartRepository, transactionRepository)

	e.GET("/users", h.FindUsers)
	e.GET("/user/:id", h.GetUser)
	e.PATCH("/user", middleware.Auth(h.UpdateUser))
	e.DELETE("/user", middleware.Auth(h.DeleteUser))
}
