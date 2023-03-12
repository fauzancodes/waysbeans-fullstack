package models

import "time"

type Product struct {
	ID          int                   `json:"id" gorm:"primary_key:auto_increment"`
	Name        string                `json:"name" form:"name" gorm:"type: varchar(255)"`
	Description string                `json:"description" gorm:"type:text" form:"description"`
	Price       int                   `json:"price" form:"price" gorm:"type: int"`
	Photo       string                `json:"photo" form:"photo" gorm:"type: varchar(255)"`
	Stock       int                   `json:"stock" form:"stock" gorm:"type: int"`
	Cart        []CartProductResponse `json:"cart"`
	CreatedAt   time.Time             `json:"-"`
	UpdatedAt   time.Time             `json:"-"`
}

type ProductCartResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	Photo       string `json:"photo"`
	Stock       int    `json:"stock"`
}

func (ProductCartResponse) TableName() string {
	return "products"
}
