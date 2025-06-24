package main

import (
	"testing"
)


func Test_applyPromo(t *testing.T) {
	type TestData struct {
		name  string
		Items []CartItem
		want  float64
	}

	tests := []TestData{
		TestData{
			name: "Test Discount",
			Items: []CartItem{
				CartItem{
					Quantity: 10,
					Product: Product{
						Price:              100,
						DiscountApplicable: true,
					},
				},
			},
			want: 900,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := applyPromo(tt.Items)
			if got != tt.want {
				t.Errorf("applyPromo() = %v, want %v", got, tt.want)
			}
		})
	}
}
