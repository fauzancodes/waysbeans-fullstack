package models

type ProductTransaction struct {
	ID            int    `json:"id" gorm:"primary_key:auto_increment"`
	ProductID     int    `json:"product_id"`
	ProductName   string `json:"product_name" gorm:"type: varchar(255)"`
	ProductPhoto  string `json:"product_photo" gorm:"type: varchar(255)"`
	ProductPrice  int    `json:"product_price" gorm:"type: int"`
	OrderQuantity int    `json:"order_quantity" gorm:"type: int"`
	TransactionID int    `json:"-"`
}
