package routes

import (
	"waysbeans/handlers"
	"waysbeans/pkg/middleware"
	"waysbeans/pkg/postgresql"
	"waysbeans/repositories"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Group) {
	userRepository := repositories.RepositoryUser(postgresql.DB)
	profileRepository := repositories.RepositoryProfile(postgresql.DB)
	cartRepository := repositories.RepositoryCart(postgresql.DB)
	transactionRepository := repositories.RepositoryTransaction(postgresql.DB)
	h := handlers.HandlerUser(userRepository, profileRepository, cartRepository, transactionRepository)

	e.GET("/users", h.FindUsers)
	e.GET("/user/:id", h.GetUser)
	e.PATCH("/user", middleware.Auth(h.UpdateUser))
	e.DELETE("/user", middleware.Auth(h.DeleteUser))
}
