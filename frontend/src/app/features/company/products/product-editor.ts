import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiButtonComponent, UiCardComponent, UiPageShellComponent],
  templateUrl: './product-editor.html',
  styleUrls: ['./product-editor.css']
})
export class ProductEditorComponent {
  @Input() product: any = null;
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      mrp: [0, Validators.required],
      gst: [0, Validators.required],
      brand: [''],
      packSize: [''],
      weight: [''],
      launchStatus: ['draft'],
    });
  }

  ngOnChanges(): void {
    if (this.product) {
      this.form.patchValue(this.product);
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files.length ? event.target.files[0] : null;
  }

  save() {
    const payload = this.form.value;
    const request$ = this.product?._id ? this.productService.updateProduct(this.product._id, payload) : this.productService.createProduct(payload);

    request$.subscribe({
      next: (savedProduct) => {
        if (this.selectedFile && savedProduct?._id) {
          this.productService.uploadImage(savedProduct._id, this.selectedFile).subscribe({
            next: () => this.saved.emit(),
            error: (err) => { console.error(err); this.saved.emit(); }
          });
        } else {
          this.saved.emit();
        }
      },
      error: (err) => console.error(err)
    });
  }
}
