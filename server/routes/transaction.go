package routes

import (
	"waysbeans/handlers"
	"waysbeans/pkg/middleware"
	"waysbeans/pkg/mysql"
	"waysbeans/repositories"

	"github.com/labstack/echo/v4"
)

func TransactionRoutes(e *echo.Group) {
	transactionRepository := repositories.RepositoryTransaction(mysql.DB)
	userRepository := repositories.RepositoryUser(mysql.DB)
	productRepository := repositories.RepositoryProduct(mysql.DB)
	cartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandlerTransaction(transactionRepository, userRepository, productRepository, cartRepository)

	e.GET("/transactions", h.FindTransactions)
	e.GET("/transaction/:id", middleware.Auth(h.GetTransaction))
	e.POST("/transaction", middleware.Auth(h.CreateTransaction))
	e.POST("/notification", h.Notification)
}
