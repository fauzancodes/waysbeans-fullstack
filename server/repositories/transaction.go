package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransactions() ([]models.WaysBeansTransaction, error)
	GetTransaction(ID int) (models.WaysBeansTransaction, error)
	CreateTransaction(transaction models.WaysBeansTransaction) (models.WaysBeansTransaction, error)
	DeleteTransaction(transaction models.WaysBeansTransaction) (models.WaysBeansTransaction, error)
	UpdateTransaction(status string, orderId int) (models.WaysBeansTransaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindTransactions() ([]models.WaysBeansTransaction, error) {
	var transactions []models.WaysBeansTransaction
	err := r.db.Preload("User").Preload("ProductTransaction").Find(&transactions).Error

	return transactions, err
}

func (r *repository) GetTransaction(ID int) (models.WaysBeansTransaction, error) {
	var transaction models.WaysBeansTransaction
	err := r.db.Preload("User").Preload("ProductTransaction").First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) CreateTransaction(transaction models.WaysBeansTransaction) (models.WaysBeansTransaction, error) {
	err := r.db.Create(&transaction).Error

	return transaction, err
}

func (r *repository) UpdateTransaction(status string, orderId int) (models.WaysBeansTransaction, error) {
	var transaction models.WaysBeansTransaction
	r.db.Preload("User").Preload("ProductTransaction").First(&transaction, orderId)

	if status != transaction.Status && status == "success" {
		for _, product := range transaction.ProductTransaction {
			var productData models.WaysBeansProduct
			r.db.First(&productData, product.ProductID)
			productData.Stock = productData.Stock - product.OrderQuantity
			r.db.Save(&productData)
		}
	}

	transaction.Status = status
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *repository) DeleteTransaction(transaction models.WaysBeansTransaction) (models.WaysBeansTransaction, error) {
	err := r.db.Delete(&transaction).Scan(&transaction).Error

	return transaction, err
}
