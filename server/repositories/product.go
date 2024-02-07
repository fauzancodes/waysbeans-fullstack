package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type ProductRepository interface {
	FindProducts() ([]models.WaysBeansProduct, error)
	GetProduct(ID int) (models.WaysBeansProduct, error)
	CreateProduct(product models.WaysBeansProduct) (models.WaysBeansProduct, error)
	DeleteProduct(product models.WaysBeansProduct) (models.WaysBeansProduct, error)
	UpdateProduct(product models.WaysBeansProduct) (models.WaysBeansProduct, error)
}

func RepositoryProduct(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindProducts() ([]models.WaysBeansProduct, error) {
	var products []models.WaysBeansProduct
	err := r.db.Preload("Cart").Find(&products).Error

	return products, err
}

func (r *repository) GetProduct(ID int) (models.WaysBeansProduct, error) {
	var product models.WaysBeansProduct
	err := r.db.Preload("Cart").First(&product, ID).Error

	return product, err
}

func (r *repository) CreateProduct(product models.WaysBeansProduct) (models.WaysBeansProduct, error) {
	err := r.db.Create(&product).Error

	return product, err
}

func (r *repository) DeleteProduct(product models.WaysBeansProduct) (models.WaysBeansProduct, error) {
	err := r.db.Delete(&product).Scan(&product).Error

	return product, err
}

func (r *repository) UpdateProduct(product models.WaysBeansProduct) (models.WaysBeansProduct, error) {
	err := r.db.Save(&product).Error

	return product, err
}
