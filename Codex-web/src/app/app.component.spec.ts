import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  beforeEach(async () => {
    getItemSpy = spyOn(window.localStorage, 'getItem').and.returnValue(null);
    setItemSpy = spyOn(window.localStorage, 'setItem');

    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  afterEach(() => {
    getItemSpy.and.callThrough();
    setItemSpy.and.callThrough();
    window.localStorage.clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the heading', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Tu lista de tareas');
  });

  it('should add a todo and persist it', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.newTaskTitle = 'Probar Angular';
    app.addTask();

    expect(app.todos.length).toBe(1);
    expect(app.todos[0].title).toBe('Probar Angular');
    expect(setItemSpy).toHaveBeenCalledWith('codex-web-todos', jasmine.any(String));
  });

  it('should load existing todos from localStorage', () => {
    const storedTodos = [
      { id: 1, title: 'Aprender Angular', completed: false },
      { id: 2, title: 'Crear un TODO', completed: true },
    ];

    getItemSpy.and.returnValue(JSON.stringify(storedTodos));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.todos.length).toBe(2);
    expect(app.todos[0].title).toBe('Aprender Angular');
    expect(app.todos[1].completed).toBeTrue();
  });
});
