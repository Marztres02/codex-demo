import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'Lista de tareas' title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Lista de tareas');
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Lista de tareas');
  });

  it('should add a todo and persist it', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const setItemSpy = spyOn(window.localStorage, 'setItem').and.callThrough();

    app.newTodo = 'Comprar leche';
    app.addTodo();

    expect(app.todos.length).toBe(1);
    expect(app.todos[0].text).toBe('Comprar leche');
    expect(app.newTodo).toBe('');
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('should toggle the completion state of a todo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.newTodo = 'Aprender Angular';
    app.addTodo();

    const todoId = app.todos[0].id;
    app.toggleTodo(todoId);

    expect(app.todos[0].completed).toBeTrue();
  });
});
