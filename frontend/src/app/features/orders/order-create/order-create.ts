import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';
import { UiCardComponent } from '../../../shared/ui/components/ui-card';
import { UiFormFieldComponent } from '../../../shared/ui/components/ui-form-field';
import { UiPageShellComponent } from '../../../shared/ui/components/ui-page-shell';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';
import { ProductService, Product } from '../../../services/product.service';
import { RetailerService } from '../../../services/retailer.service';
import { DistributorService } from '../../../services/distributor.service';

type OrderMode = 'retailer-order' | 'distributor-replenishment';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, UiButtonComponent, UiCardComponent, UiFormFieldComponent, UiPageShellComponent],
  template: `
    <ui-page-shell title="Create order" eyebrow="operations" description="Launch a new order and keep the workflow organized from the first step.">
      <ng-container slot="actions">
        <ui-button variant="secondary" routerLink="/orders">Cancel</ui-button>
        <ui-button (click)="submit()" [disabled]="submitting">Submit order</ui-button>
      </ng-container>

      <div class="module-shell">
        <ui-card title="Order details" subtitle="Capture the core order context before submission">
          <form [formGroup]="form" class="form-stack" (ngSubmit)="submit()">
            <ui-form-field label="Order type" hint="Choose the workflow that matches your role">
              <select formControlName="orderType">
                <option value="retailer-order">Retailer order</option>
                <option value="distributor-replenishment">Distributor replenishment</option>
              </select>
            </ui-form-field>

            <ui-form-field label="Product" hint="Select the product you want to place on the order">
              <select formControlName="productId">
                <option value="" disabled>Select product</option>
                <option *ngFor="let product of products" [value]="product._id">{{ product.name }}</option>
              </select>
            </ui-form-field>

            <ui-form-field label="Retailer" hint="Required for retailer orders" *ngIf="form.get('orderType')?.value === 'retailer-order'">
              <select formControlName="retailerId">
                <option value="" disabled>Select retailer</option>
                <option *ngFor="let retailer of retailers" [value]="retailer._id">{{ retailer.name || retailer.companyName || retailer._id }}</option>
              </select>
            </ui-form-field>

            <ui-form-field label="Distributor" hint="Required for replenishment flows" *ngIf="form.get('orderType')?.value === 'distributor-replenishment'">
              <select formControlName="distributorId">
                <option value="" disabled>Select distributor</option>
                <option *ngFor="let distributor of distributors" [value]="distributor._id">{{ distributor.name || distributor.companyName || distributor._id }}</option>
              </select>
            </ui-form-field>

            <div class="form-inline">
              <ui-form-field label="Quantity" hint="Item quantity">
                <input type="number" formControlName="quantity" min="1" />
              </ui-form-field>
              <ui-form-field label="Unit price" hint="Price applied to the line">
                <input type="number" formControlName="unitPrice" min="0" />
              </ui-form-field>
            </div>

            <div class="message" *ngIf="message">{{ message }}</div>
            <div class="message error" *ngIf="error">{{ error }}</div>
          </form>
        </ui-card>
      </div>
    </ui-page-shell>
  `,
  styles: [
    `.form-stack{display:grid;gap:14px}.form-inline{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.message{padding:10px 12px;border-radius:10px;background:var(--surface-alt);color:var(--text)}.message.error{background:rgba(231,76,60,.1);color:#c0392b}select,input{width:100%;border:1px solid var(--border);border-radius:10px;padding:10px 12px;background:var(--surface);color:var(--text)}@media (max-width: 640px){.form-inline{grid-template-columns:1fr}}`
  ]
})
export class OrderCreateComponent implements OnInit {
  form: FormGroup;
  loading = true;
  submitting = false;
  error: string | null = null;
  message: string | null = null;

  products: Product[] = [];
  retailers: any[] = [];
  distributors: any[] = [];
  currentRole: string | null = null;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
    private productService: ProductService,
    private retailerService: RetailerService,
    private distributorService: DistributorService
  ) {
    this.form = this.fb.group({
      orderType: ['retailer-order', Validators.required],
      retailerId: [''],
      distributorId: [''],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUserSync();
    this.currentRole = (this.currentUser?.role || 'retailer').toLowerCase().replace(/_/g, '-');
    const roleDefault: OrderMode = this.currentRole === 'distributor-admin' ? 'distributor-replenishment' : 'retailer-order';

    this.form.patchValue({
      orderType: roleDefault,
      retailerId: this.currentUser?.retailerId || '',
      distributorId: this.currentUser?.distributorId || ''
    });

    this.form.get('orderType')?.valueChanges.subscribe((mode: OrderMode) => this.applyOrderMode(mode));
    this.form.get('productId')?.valueChanges.subscribe((productId) => this.applySelectedProduct(productId));

    forkJoin({
      products: this.productService.getProducts({ limit: 100 }).pipe(catchError((err) => {
        console.error('Order product catalog failed', err);
        return of([]);
      })),
      retailers: this.retailerService.getRetailers({ limit: 100 }).pipe(catchError((err) => {
        console.error('Retailer catalog load failed', err);
        return of([]);
      })),
      distributors: this.distributorService.getDistributors({ limit: 100 }).pipe(catchError((err) => {
        console.error('Distributor catalog load failed', err);
        return of([]);
      }))
    })
      .pipe(finalize(() => {
        this.loading = false;
        this.applyOrderMode(roleDefault);
      }))
      .subscribe({
        next: ({ products, retailers, distributors }) => {
          this.products = products || [];
          this.retailers = retailers || [];
          this.distributors = distributors || [];

          const productId = this.route.snapshot.queryParamMap.get('productId');
          const retailerId = this.route.snapshot.queryParamMap.get('retailerId');
          const distributorId = this.route.snapshot.queryParamMap.get('distributorId');

          if (productId) {
            this.form.patchValue({ productId });
            this.applySelectedProduct(productId);
          } else if (this.products.length) {
            this.form.patchValue({ productId: this.products[0]._id });
            this.applySelectedProduct(this.products[0]._id);
          }

          if (retailerId) {
            this.form.patchValue({ retailerId });
          } else if (this.currentRole === 'retailer' && this.currentUser?.retailerId) {
            this.form.patchValue({ retailerId: this.currentUser.retailerId });
          }

          if (distributorId) {
            this.form.patchValue({ distributorId });
          } else if (this.currentRole === 'distributor-admin' && this.currentUser?.distributorId) {
            this.form.patchValue({ distributorId: this.currentUser.distributorId });
          }
        },
        error: () => {
          this.error = 'Unable to load order catalog right now.';
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.error = 'Please complete the order form.';
      return;
    }

    const value = this.form.value;
    const mode: OrderMode = value.orderType;
    const selectedProduct = this.products.find((product) => product._id === value.productId);
    const unitPrice = Number(value.unitPrice || selectedProduct?.mrp || 0);
    const quantity = Number(value.quantity || 1);
    const total = unitPrice * quantity;

    const payload: any = {
      orderType: mode,
      items: [{
        productId: value.productId,
        quantity,
        unitPrice
      }],
      subtotal: total,
      tax: 0,
      total
    };

    if (mode === 'retailer-order') {
      payload.retailerId = value.retailerId || this.currentUser?.retailerId;
    } else {
      payload.distributorId = value.distributorId || this.currentUser?.distributorId;
    }

    this.submitting = true;
    this.message = null;
    this.error = null;

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.message = 'Order created successfully.';
        this.form.patchValue({ quantity: 1, unitPrice });
        this.router.navigateByUrl(this.getReturnUrl());
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.message || 'Unable to create order right now.';
      }
    });
  }

  applyOrderMode(mode: OrderMode): void {
    if (mode === 'distributor-replenishment') {
      this.form.get('retailerId')?.setValidators([]);
      this.form.get('distributorId')?.setValidators([Validators.required]);
    } else {
      this.form.get('retailerId')?.setValidators([Validators.required]);
      this.form.get('distributorId')?.setValidators([]);
    }

    this.form.get('retailerId')?.updateValueAndValidity({ emitEvent: false });
    this.form.get('distributorId')?.updateValueAndValidity({ emitEvent: false });
  }

  applySelectedProduct(productId: string): void {
    const product = this.products.find((item) => item._id === productId);
    if (product?.mrp) {
      this.form.patchValue({ unitPrice: product.mrp }, { emitEvent: false });
    }
  }

  private getReturnUrl(): string {
    if (this.currentRole === 'retailer') return '/retailer/orders';
    if (this.currentRole === 'distributor-admin') return '/distributor/orders';
    return '/dashboard/orders';
  }
}
