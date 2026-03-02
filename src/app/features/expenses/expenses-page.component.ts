import { AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Category, Expense } from '../../core/models/expense.model';
import { ExpenseService } from '../../core/services/expense.service';

interface ExpenseFormValue {
  description: string;
  amount: number | null;
  category: Category | '';
}

@Component({
  standalone: true,
  selector: 'app-expenses-page',
  imports: [NgIf, NgForOf, NgClass, FormsModule, AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './expenses-page.component.html',
  styleUrl: './expenses-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesPageComponent {
  private readonly expenseService = inject(ExpenseService);

  protected readonly categories = Object.values(Category);

  protected readonly expenses = signal<Expense[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly editingId = signal<string | null>(null);

  protected readonly form = signal<ExpenseFormValue>({
    description: '',
    amount: null,
    category: ''
  });

  protected readonly isEditing = computed(() => this.editingId() !== null);

  constructor() {
    effect(() => {
      this.loadExpenses();
    });
  }

  protected loadExpenses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.expenseService.findAll().subscribe({
      next: (data) => {
        this.expenses.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erro ao carregar despesas. Tente novamente.');
        this.loading.set(false);
      }
    });
  }

  protected edit(expense: Expense): void {
    this.editingId.set(expense.id);
    this.form.set({
      description: expense.description,
      amount: expense.amount,
      category: expense.category
    });
  }

  protected remove(expense: Expense): void {
    if (!confirm('Deseja realmente remover esta despesa?')) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.expenseService.delete(expense.id).subscribe({
      next: () => this.loadExpenses(),
      error: () => {
        this.error.set('Erro ao remover despesa. Tente novamente.');
        this.loading.set(false);
      }
    });
  }

  protected submit(): void {
    const value = this.form();

    if (!value.description || !value.amount || !value.category) {
      this.error.set('Preencha todos os campos do formulário.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const payload = {
      description: value.description,
      amount: value.amount,
      category: value.category as Category
    };

    const id = this.editingId();
    const request$ = id
      ? this.expenseService.update(id, payload)
      : this.expenseService.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadExpenses();
      },
      error: () => {
        this.error.set('Erro ao salvar despesa. Tente novamente.');
        this.loading.set(false);
      }
    });
  }

  protected cancelEdit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.form.set({
      description: '',
      amount: null,
      category: ''
    });
  }
}

