package models

import "time"

type Cart struct {
	ID            int                 `json:"id" gorm:"primary_key:auto_increment"`
	UserID        int                 `json:"user_id" gorm:"type: int"`
	User          UsersCartResponse   `json:"user"`
	ProductID     int                 `json:"product_id" gorm:"type: int"`
	Product       ProductCartResponse `json:"product"`
	OrderQuantity int                 `json:"order_quantity" gorm:"type: int"`
	CreatedAt     time.Time           `json:"-"`
	UpdatedAt     time.Time           `json:"-"`
}

type CartUSerResponse struct {
	ID            int `json:"id"`
	ProductID     int `json:"product_id"`
	OrderQuantity int `json:"order_quantity"`
	UserID        int `json:"-"`
}

type CartProductResponse struct {
	ProductID     int                 `json:"-"`
	Product       ProductCartResponse `json:"product"`
	OrderQuantity int                 `json:"order_quantity"`
	UserID        int                 `json:"user_id"`
}

func (CartUSerResponse) TableName() string {
	return "carts"
}

func (CartProductResponse) TableName() string {
	return "carts"
}
