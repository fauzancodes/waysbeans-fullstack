package models

import "time"

type WaysBeansTransaction struct {
	ID                 int                              `json:"id" gorm:"primary_key:auto_increment"`
	UserID             int                              `json:"-"`
	User               WaysBeansUserTransactionResponse `json:"user"`
	Name               string                           `json:"name" gorm:"type varchar(255)"`
	Email              string                           `json:"email" gorm:"type varchar(255)"`
	Phone              string                           `json:"phone" gorm:"type varchar(255)"`
	Address            string                           `json:"address" gorm:"type varchar(255)"`
	ProductTransaction []WaysBeansProductTransaction    `json:"products" gorm:"foreignKey:TransactionID"`
	TotalQuantity      int                              `json:"total_quantity" gorm:"type: int"`
	TotalPrice         int                              `json:"total_price" gorm:"type: int"`
	Status             string                           `json:"status" gorm:"type: varchar(255)"`
	CreatedAt          time.Time                        `json:"date"`
	UpdatedAt          time.Time                        `json:"-"`
}

type WaysBeansTransactionUSerResponse struct {
	ID            int    `json:"id"`
	UserID        int    `json:"-" gorm:"index"`
	TotalQuantity int    `json:"total_quantity"`
	TotalPrice    int    `json:"total_price"`
	Status        string `json:"status" gorm:"type: varchar(255)"`
}

func (WaysBeansTransactionUSerResponse) TableName() string {
	return "ways_beans_transactions"
}
