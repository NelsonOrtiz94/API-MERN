# 🎓 Guía Completa de Angular - Conceptos Fundamentales y Arquitectura Hexagonal

## Índice
1. [Componentes](#componentes)
2. [Servicios](#servicios)
3. [Consumo de APIs](#consumo-de-apis)
4. [Guards (Guardias)](#guards)
5. [Directivas](#directivas)
6. [Anotaciones (Decoradores)](#anotaciones)
7. [RxJS](#rxjs)
8. [Pruebas Unitarias](#pruebas-unitarias)
9. [Arquitectura Hexagonal en Angular](#arquitectura-hexagonal)

---

## 1️⃣ Componentes

### ¿Qué es un componente?
Un componente es la unidad básica de una aplicación Angular. Está formado por:
- **Template (HTML)**: La vista
- **Clase TypeScript**: La lógica
- **Estilos (CSS)**: El diseño

### Estructura básica

```typescript
// product.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  
  // Propiedades
  @Input() product: any; // Recibe datos del padre
  @Output() productSelected = new EventEmitter<any>(); // Envía datos al padre
  
  productName: string = 'Laptop';
  quantity: number = 0;
  
  constructor() {}
  
  ngOnInit(): void {
    console.log('Componente inicializado');
  }
  
  // Métodos
  selectProduct() {
    this.productSelected.emit(this.product);
  }
  
  incrementQuantity() {
    this.quantity++;
  }
}
```

```html
<!-- product.component.html -->
<div class="product-card">
  <h2>{{ productName }}</h2>
  <p>Cantidad: {{ quantity }}</p>
  <button (click)="incrementQuantity()">Aumentar</button>
  <button (click)="selectProduct()">Seleccionar Producto</button>
</div>
```

```css
/* product.component.css */
.product-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin: 10px;
}
```

### Ciclo de vida de un componente

```typescript
import { 
  Component, 
  OnInit, 
  OnChanges, 
  OnDestroy,
  AfterViewInit,
  SimpleChanges 
} from '@angular/core';

export class LifecycleComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  
  ngOnInit(): void {
    // Se ejecuta después de que el componente se inicializa
    console.log('ngOnInit');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta cuando cambian las propiedades @Input
    console.log('ngOnChanges', changes);
  }
  
  ngAfterViewInit(): void {
    // Se ejecuta después de que la vista se ha inicializado
    console.log('ngAfterViewInit');
  }
  
  ngOnDestroy(): void {
    // Se ejecuta justo antes de que el componente se destruya
    console.log('ngOnDestroy');
  }
}
```

---

## 2️⃣ Servicios

### ¿Qué es un servicio?
Un servicio es una clase reutilizable que contiene lógica de negocio. Se inyecta en componentes para evitar duplicar código.

### Crear un servicio

```typescript
// product.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // El servicio está disponible en toda la aplicación
})
export class ProductService {
  
  private products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Teclado', price: 75 }
  ];
  
  // BehaviorSubject para manejar estado
  private productsSubject = new BehaviorSubject<any[]>(this.products);
  public products$ = this.productsSubject.asObservable();
  
  constructor() {}
  
  // Obtener todos los productos
  getProducts(): Observable<any[]> {
    return this.products$;
  }
  
  // Obtener un producto por ID
  getProductById(id: number): any {
    return this.products.find(p => p.id === id);
  }
  
  // Agregar un producto
  addProduct(product: any): void {
    this.products.push(product);
    this.productsSubject.next([...this.products]);
  }
  
  // Eliminar un producto
  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.productsSubject.next([...this.products]);
  }
}
```

### Usar un servicio en un componente

```typescript
// home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  products: any[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(private productService: ProductService) {}
  
  ngOnInit(): void {
    // Suscribirse al observable de productos
    this.productService.getProducts()
      .pipe(
        takeUntil(this.destroy$) // Para evitar memory leaks
      )
      .subscribe(products => {
        this.products = products;
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 3️⃣ Consumo de APIs

### HTTP Client en Angular

```typescript
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private baseUrl = 'http://localhost:5000/api';
  
  constructor(private http: HttpClient) {}
  
  // GET - Obtener todos los productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Error fetching products', error);
          return throwError(() => error);
        })
      );
  }
  
  // GET - Obtener producto por ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  
  // POST - Crear un nuevo producto
  createProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/products`, product, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // PUT - Actualizar un producto
  updateProduct(id: number, product: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(`${this.baseUrl}/products/${id}`, product, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // DELETE - Eliminar un producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // Manejo de errores centralizado
  private handleError(error: any) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

### Usar el servicio de API en un componente

```typescript
// product-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  
  products: any[] = [];
  loading: boolean = false;
  error: string = '';
  private destroy$ = new Subject<void>();
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar productos';
          this.loading = false;
          console.error(err);
        }
      });
  }
  
  deleteProduct(id: number): void {
    this.apiService.deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          this.error = 'Error al eliminar producto';
          console.error(err);
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 4️⃣ Guards (Guardias)

### ¿Qué es un Guard?
Un Guard es una función que decide si una ruta puede ser activada, desactivada o cargada. Útil para proteger rutas.

### Crear un Guard de autenticación

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (isAuthenticated) {
      return true;
    } else {
      // Redirigir al login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```

### Guard para desactivar una ruta

```typescript
// unsaved-changes.guard.ts
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```

### Usar Guards en el routing

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard] // Proteger esta ruta
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 5️⃣ Directivas

### ¿Qué es una directiva?
Una directiva modifica el DOM o agrega comportamiento a elementos HTML.

### Directivas integradas

```html
<!-- Condicionales -->
<div *ngIf="isVisible">Este contenido es visible</div>

<div *ngIf="user; else noUser">
  <p>Bienvenido, {{ user.name }}</p>
</div>
<ng-template #noUser>
  <p>Por favor, inicia sesión</p>
</ng-template>

<!-- Bucles -->
<ul>
  <li *ngFor="let product of products; let i = index">
    {{ i + 1 }}. {{ product.name }} - ${{ product.price }}
  </li>
</ul>

<!-- Switch -->
<div [ngSwitch]="status">
  <div *ngSwitchCase="'active'">Producto activo</div>
  <div *ngSwitchCase="'inactive'">Producto inactivo</div>
  <div *ngSwitchDefault>Estado desconocido</div>
</div>

<!-- Clases dinámicas -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
  Contenido
</div>

<!-- Estilos dinámicos -->
<div [ngStyle]="{ 'background-color': bgColor, 'color': textColor }">
  Contenido con estilos dinámicos
</div>
```

### Crear una directiva personalizada

```typescript
// highlight.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  
  @Input() appHighlight = 'yellow';
  @Input() defaultColor = 'white';
  
  constructor(private el: ElementRef) {
    this.setColor(this.defaultColor);
  }
  
  @HostListener('mouseenter')
  onMouseEnter() {
    this.setColor(this.appHighlight);
  }
  
  @HostListener('mouseleave')
  onMouseLeave() {
    this.setColor(this.defaultColor);
  }
  
  private setColor(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```

### Usar una directiva personalizada

```html
<!-- En el template -->
<p appHighlight="lightblue" defaultColor="white">
  Esta línea se pone azul al pasar el ratón
</p>

<div appHighlight="pink">
  Este div se pone rosa al pasar el ratón
</div>
```

---

## 6️⃣ Anotaciones (Decoradores)

### ¿Qué son los decoradores?
Los decoradores son funciones que añaden metadatos a clases, métodos, propiedades o parámetros.

### Decoradores más importantes

```typescript
// Decoradores de clase
@Component({...})
@Directive({...})
@Injectable({...})
@NgModule({...})
@Pipe({...})

// Decoradores de propiedades
@Input()
@Output()
@ViewChild()
@ViewChildren()
@ContentChild()
@ContentChildren()
@HostBinding()
@HostListener()

// Ejemplo completo
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent {
  
  @Input() title: string = '';
  @Output() onSubmit = new EventEmitter<any>();
  @ViewChild('submitBtn') submitBtn!: ElementRef;
  
  formData: any = {};
  
  submit() {
    this.onSubmit.emit(this.formData);
  }
}
```

---

## 7️⃣ RxJS

### ¿Qué es RxJS?
RxJS proporciona herramientas para trabajar con datos asincronos usando observables.

### Conceptos básicos

```typescript
import { 
  Observable, 
  Subject, 
  BehaviorSubject, 
  ReplaySubject,
  of,
  from,
  interval,
  timer
} from 'rxjs';
import { 
  map, 
  filter, 
  merge, 
  switchMap, 
  flatMap,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  tap,
  catchError
} from 'rxjs/operators';

// Observable básico
const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.complete();
});

observable.subscribe(value => console.log(value));

// Subject - Pueden emitir valores y otros pueden suscribirse
const subject = new Subject<number>();
subject.subscribe(value => console.log('Suscriptor 1:', value));
subject.subscribe(value => console.log('Suscriptor 2:', value));
subject.next(100);

// BehaviorSubject - Emite el último valor a nuevos suscriptores
const behaviorSubject = new BehaviorSubject<string>('inicial');
behaviorSubject.subscribe(value => console.log(value)); // Imprime 'inicial'
behaviorSubject.next('nuevo');

// Operadores comunes
from([1, 2, 3, 4, 5])
  .pipe(
    filter(x => x > 2),
    map(x => x * 2),
    tap(x => console.log('Valor procesado:', x))
  )
  .subscribe(result => console.log('Resultado final:', result));

// debounceTime - Espera X ms antes de emitir
const searchTerm$ = new Subject<string>();
searchTerm$
  .pipe(
    debounceTime(500),
    distinctUntilChanged()
  )
  .subscribe(term => {
    console.log('Buscar:', term);
  });

// switchMap - Cambiar de un observable a otro
const id$ = new Subject<number>();
id$
  .pipe(
    switchMap(id => this.productService.getProductById(id))
  )
  .subscribe(product => console.log(product));
```

### Patrón de servicio con RxJS

```typescript
// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
  
  constructor() {}
  
  addToCart(item: CartItem): void {
    const existingItem = this.cartItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    
    this.cartSubject.next([...this.cartItems]);
  }
  
  removeFromCart(id: number): void {
    this.cartItems = this.cartItems.filter(i => i.id !== id);
    this.cartSubject.next([...this.cartItems]);
  }
  
  getTotalPrice(): Observable<number> {
    return this.cart$.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }
}
```

---

## 8️⃣ Pruebas Unitarias

### Prueba de componentes

```typescript
// product.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent]
    }).compileComponents();
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should increment quantity', () => {
    component.quantity = 0;
    component.incrementQuantity();
    expect(component.quantity).toBe(1);
  });
  
  it('should emit product when selected', (done) => {
    component.product = { id: 1, name: 'Laptop' };
    
    component.productSelected.subscribe((product: any) => {
      expect(product.id).toBe(1);
      done();
    });
    
    component.selectProduct();
  });
});
```

### Prueba de servicios

```typescript
// api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch products', () => {
    const mockProducts = [
      { id: 1, name: 'Laptop', price: 999 },
      { id: 2, name: 'Mouse', price: 25 }
    ];
    
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products[0].name).toBe('Laptop');
    });
    
    const req = httpMock.expectOne('http://localhost:5000/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
  
  it('should create a product', () => {
    const newProduct = { id: 3, name: 'Teclado', price: 75 };
    
    service.createProduct(newProduct).subscribe(product => {
      expect(product.id).toBe(3);
    });
    
    const req = httpMock.expectOne('http://localhost:5000/api/products');
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });
});
```

---

## 9️⃣ Arquitectura Hexagonal en Angular

### ¿Qué es la arquitectura hexagonal?
La arquitectura hexagonal (también llamada puertos y adaptadores) separa la lógica de negocio de los detalles técnicos (API, base de datos, UI).

### Estructura de carpetas

```
src/
├── app/
│   ├── domain/                    # Lógica de negocio pura
│   │   ├── entities/
│   │   │   └── product.ts
│   │   ├── interfaces/
│   │   │   └── product-repository.interface.ts
│   │   └── services/
│   │       └── product-domain.service.ts
│   │
│   ├── application/              # Casos de uso y dtos
│   │   ├── dtos/
│   │   │   ├── create-product.dto.ts
│   │   │   └── product-response.dto.ts
│   │   └── use-cases/
│   │       ├── create-product.use-case.ts
│   │       ├── get-products.use-case.ts
│   │       └── delete-product.use-case.ts
│   │
│   ├── infrastructure/           # Implementaciones técnicas
│   │   ├── repositories/
│   │   │   └── product-repository.impl.ts
│   │   ├── http/
│   │   │   └── http-client.adapter.ts
│   │   └── mappers/
│   │       └── product.mapper.ts
│   │
│   └── presentation/             # Componentes e inyección
│       ├── components/
│       │   └── product-list/
│       ├── pages/
│       │   └── home/
│       └── modules/
│           └── product.module.ts
```

### Implementación paso a paso

#### 1. Entidad de dominio

```typescript
// domain/entities/product.ts
export class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public description: string
  ) {}
}
```

#### 2. Interfaz del puerto

```typescript
// domain/interfaces/product-repository.interface.ts
import { Observable } from 'rxjs';
import { Product } from '../entities/product';

export interface IProductRepository {
  findAll(): Observable<Product[]>;
  findById(id: number): Observable<Product>;
  save(product: Product): Observable<Product>;
  delete(id: number): Observable<void>;
}
```

#### 3. Servicio de dominio

```typescript
// domain/services/product-domain.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../entities/product';

@Injectable({
  providedIn: 'root'
})
export class ProductDomainService {
  
  calculateDiscount(product: Product, discountPercent: number): number {
    return product.price * (1 - discountPercent / 100);
  }
  
  isProductAvailable(product: Product): boolean {
    return product.price > 0;
  }
}
```

#### 4. DTOs de aplicación

```typescript
// application/dtos/create-product.dto.ts
export class CreateProductDTO {
  constructor(
    public name: string,
    public price: number,
    public description: string
  ) {}
}

// application/dtos/product-response.dto.ts
export class ProductResponseDTO {
  id: number;
  name: string;
  price: number;
  description: string;
  discountedPrice?: number;
}
```

#### 5. Casos de uso

```typescript
// application/use-cases/get-products.use-case.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductRepository } from '../../domain/interfaces/product-repository.interface';
import { Product } from '../../domain/entities/product';

@Injectable({
  providedIn: 'root'
})
export class GetProductsUseCase {
  
  constructor(private productRepository: IProductRepository) {}
  
  execute(): Observable<Product[]> {
    return this.productRepository.findAll();
  }
}
```

```typescript
// application/use-cases/create-product.use-case.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductRepository } from '../../domain/interfaces/product-repository.interface';
import { Product } from '../../domain/entities/product';
import { CreateProductDTO } from '../dtos/create-product.dto';

@Injectable({
  providedIn: 'root'
})
export class CreateProductUseCase {
  
  constructor(private productRepository: IProductRepository) {}
  
  execute(dto: CreateProductDTO): Observable<Product> {
    const product = new Product(0, dto.name, dto.price, dto.description);
    return this.productRepository.save(product);
  }
}
```

#### 6. Adaptador (Repositorio)

```typescript
// infrastructure/repositories/product-repository.impl.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProductRepository } from '../../domain/interfaces/product-repository.interface';
import { Product } from '../../domain/entities/product';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable({
  providedIn: 'root'
})
export class ProductRepositoryImpl implements IProductRepository {
  
  private baseUrl = 'http://localhost:5000/api/products';
  
  constructor(
    private http: HttpClient,
    private mapper: ProductMapper
  ) {}
  
  findAll(): Observable<Product[]> {
    return new Observable(subscriber => {
      this.http.get<any[]>(this.baseUrl).subscribe({
        next: (data) => {
          const products = data.map(item => this.mapper.toDomain(item));
          subscriber.next(products);
          subscriber.complete();
        },
        error: (err) => subscriber.error(err)
      });
    });
  }
  
  findById(id: number): Observable<Product> {
    return new Observable(subscriber => {
      this.http.get<any>(`${this.baseUrl}/${id}`).subscribe({
        next: (data) => {
          subscriber.next(this.mapper.toDomain(data));
          subscriber.complete();
        },
        error: (err) => subscriber.error(err)
      });
    });
  }
  
  save(product: Product): Observable<Product> {
    return new Observable(subscriber => {
      const dto = this.mapper.toPersistence(product);
      this.http.post<any>(this.baseUrl, dto).subscribe({
        next: (data) => {
          subscriber.next(this.mapper.toDomain(data));
          subscriber.complete();
        },
        error: (err) => subscriber.error(err)
      });
    });
  }
  
  delete(id: number): Observable<void> {
    return new Observable(subscriber => {
      this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe({
        next: () => subscriber.complete(),
        error: (err) => subscriber.error(err)
      });
    });
  }
}
```

#### 7. Mapper

```typescript
// infrastructure/mappers/product.mapper.ts
import { Injectable } from '@angular/core';
import { Product } from '../../domain/entities/product';
import { ProductResponseDTO } from '../../application/dtos/product-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductMapper {
  
  // Convertir de DTO/API a entidad de dominio
  toDomain(raw: any): Product {
    return new Product(
      raw.id,
      raw.name,
      raw.price,
      raw.description
    );
  }
  
  // Convertir de entidad de dominio a DTO de respuesta
  toResponse(product: Product): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description
    };
  }
  
  // Convertir de entidad a datos para persistencia
  toPersistence(product: Product): any {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description
    };
  }
}
```

#### 8. Componente presentación

```typescript
// presentation/pages/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetProductsUseCase } from '../../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case';
import { Product } from '../../../domain/entities/product';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  products: Product[] = [];
  loading: boolean = false;
  error: string = '';
  private destroy$ = new Subject<void>();
  
  constructor(
    private getProductsUseCase: GetProductsUseCase,
    private createProductUseCase: CreateProductUseCase
  ) {}
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.getProductsUseCase.execute()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar productos';
          this.loading = false;
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### 9. Configuración de módulo con inyección de dependencias

```typescript
// presentation/modules/product.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Use cases
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';

// Repositorio e implementación
import { IProductRepository } from '../../domain/interfaces/product-repository.interface';
import { ProductRepositoryImpl } from '../../infrastructure/repositories/product-repository.impl';

// Servicios
import { ProductDomainService } from '../../domain/services/product-domain.service';

// Mapper
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

// Componentes
import { HomeComponent } from '../pages/home/home.component';
import { ProductListComponent } from '../components/product-list/product-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // Inyectar la implementación cuando se solicite la interfaz
    {
      provide: IProductRepository,
      useClass: ProductRepositoryImpl
    },
    ProductDomainService,
    ProductMapper,
    GetProductsUseCase,
    CreateProductUseCase,
    DeleteProductUseCase
  ]
})
export class ProductModule { }
```

### Ventajas de la arquitectura hexagonal

✅ **Separación de responsabilidades**: Cada capa tiene un propósito claro
✅ **Testeable**: Fácil de crear tests unitarios
✅ **Mantenible**: Cambios en la infraestructura no afectan la lógica de negocio
✅ **Reutilizable**: Los casos de uso pueden usarse en diferentes contextos (web, mobile, etc.)
✅ **Flexible**: Cambiar de API a base de datos local es sencillo
✅ **SOLID**: Sigue los principios SOLID

### Flujo de datos en arquitectura hexagonal

```
Componente (Presentación)
    ↓
Caso de uso (Aplicación)
    ↓
Lógica de negocio (Dominio)
    ↓
Repositorio (Infraestructura - Puerto)
    ↓
HTTP/BD (Infraestructura - Adaptador)
    ↓
API/Base de datos externa
```

---

## 📚 Tabla Comparativa de Conceptos

| Concepto | Propósito | Ejemplo |
|----------|-----------|---------|
| **Componente** | Bloque de UI con lógica | ProductCard, Header |
| **Servicio** | Lógica reutilizable | ProductService, AuthService |
| **Guard** | Proteger rutas | AuthGuard, UnsavedChangesGuard |
| **Directiva** | Modificar DOM | *ngIf, *ngFor, appHighlight |
| **Observable** | Manejo de datos async | HTTP requests, eventos |
| **RxJS Operator** | Transformar observables | map, filter, switchMap |
| **Caso de uso** | Una acción específica | GetProducts, CreateOrder |
| **Repositorio** | Acceso a datos | ProductRepository |

---

## 🚀 Resumen de mejores prácticas

1. **Componentes pequeños y reutilizables**
2. **Servicios para compartir lógica**
3. **Observables para datos asincronos**
4. **Guards para seguridad**
5. **Directivas para comportamiento DOM**
6. **Arquitectura hexagonal para escalabilidad**
7. **Pruebas unitarias obligatorias**
8. **RxJS para programación reactiva**
9. **Inyección de dependencias siempre**
10. **Separación clara entre capas**

---

## 📖 Recursos adicionales

- [Documentación oficial de Angular](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Testing Guide](https://angular.io/guide/testing)
- [Angular Architecture Patterns](https://angular.io/guide/styleguide)

¡Ahora tienes una guía completa para dominar Angular y arquitectura hexagonal! 🎉
