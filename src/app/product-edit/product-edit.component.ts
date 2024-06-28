import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]]
    });

    this.productService.getProduct(this.productId).subscribe((product) => {
      this.productForm.patchValue(product);
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const updatedProduct: Product = { ...this.productForm.value, id: this.productId };
      this.productService.updateProduct(updatedProduct).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
