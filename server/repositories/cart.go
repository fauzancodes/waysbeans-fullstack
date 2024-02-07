package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type CartRepository interface {
	FindCarts() ([]models.WaysBeansCart, error)
	GetCart(ID int) (models.WaysBeansCart, error)
	CreateCart(cart models.WaysBeansCart) (models.WaysBeansCart, error)
	UpdateCart(cart models.WaysBeansCart) (models.WaysBeansCart, error)
	DeleteCart(cart models.WaysBeansCart) (models.WaysBeansCart, error)
}

func RepositoryCart(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindCarts() ([]models.WaysBeansCart, error) {
	var carts []models.WaysBeansCart
	err := r.db.Preload("User").Preload("Product").Find(&carts).Error

	return carts, err
}

func (r *repository) GetCart(ID int) (models.WaysBeansCart, error) {
	var cart models.WaysBeansCart
	err := r.db.Preload("User").Preload("Product").First(&cart, ID).Error

	return cart, err
}

func (r *repository) CreateCart(cart models.WaysBeansCart) (models.WaysBeansCart, error) {
	err := r.db.Create(&cart).Error

	return cart, err
}

func (r *repository) UpdateCart(cart models.WaysBeansCart) (models.WaysBeansCart, error) {
	err := r.db.Save(&cart).Error

	return cart, err
}

func (r *repository) DeleteCart(cart models.WaysBeansCart) (models.WaysBeansCart, error) {
	err := r.db.Delete(&cart).Scan(&cart).Error

	return cart, err
}
