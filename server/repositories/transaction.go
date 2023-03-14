package repositories

import (
	"waysbeans/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransactions() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	DeleteTransaction(transaction models.Transaction) (models.Transaction, error)
	UpdateTransaction(status string, orderId int) (models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Preload("User").Preload("ProductTransaction").Find(&transactions).Error

	return transactions, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("User").Preload("ProductTransaction").First(&transaction, ID).Error

	return transaction, err
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error

	return transaction, err
}

func (r *repository) UpdateTransaction(status string, orderId int) (models.Transaction, error) {
  var transaction models.Transaction
  r.db.Preload("User").Preload("ProductTransaction").First(&transaction, orderId)

  if status != transaction.Status && status == "success" {
		for _, product := range transaction.ProductTransaction {
			var productData models.Product
			r.db.First(&productData, product.ProductID)
			productData.Stock = productData.Stock - product.OrderQuantity
			r.db.Save(&productData)
		}
  }

  transaction.Status = status
  err := r.db.Save(&transaction).Error
  return transaction, err
}

func (r *repository) DeleteTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Delete(&transaction).Scan(&transaction).Error

	return transaction, err
}
