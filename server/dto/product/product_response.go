package productdto

type ProductResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	Photo       string `json:"photo"`
	Stock       int    `json:"stock"`
}
