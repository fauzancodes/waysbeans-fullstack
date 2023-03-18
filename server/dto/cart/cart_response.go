package cartsdto

type CartResponse struct {
	ID            int `json:"id"`
	ProductID     int `json:"product_id"`
	OrderQuantity int `json:"order_quantity"`
	UserID        int `json:"user_id"`
}
