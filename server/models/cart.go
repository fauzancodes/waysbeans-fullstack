package models

import "time"

type WaysBeansCart struct {
	ID            int                          `json:"id" gorm:"primary_key:auto_increment"`
	UserID        int                          `json:"user_id" gorm:"type: int"`
	User          WaysBeansUsersCartResponse   `json:"user"`
	ProductID     int                          `json:"product_id" gorm:"type: int"`
	Product       WaysBeansProductCartResponse `json:"product"`
	OrderQuantity int                          `json:"order_quantity" gorm:"type: int"`
	CreatedAt     time.Time                    `json:"-"`
	UpdatedAt     time.Time                    `json:"-"`
}

type WaysBeansCartUSerResponse struct {
	ID            int `json:"id"`
	ProductID     int `json:"product_id"`
	OrderQuantity int `json:"order_quantity"`
	UserID        int `json:"-"`
}

type WaysBeansCartProductResponse struct {
	ProductID     int                          `json:"-"`
	Product       WaysBeansProductCartResponse `json:"product"`
	OrderQuantity int                          `json:"order_quantity"`
	UserID        int                          `json:"user_id"`
}

func (WaysBeansCartUSerResponse) TableName() string {
	return "ways_beans_carts"
}

func (WaysBeansCartProductResponse) TableName() string {
	return "ways_beans_carts"
}
