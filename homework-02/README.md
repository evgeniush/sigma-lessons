# Консольний калькулятор

Підтримує чотири основні арифметичні операції:

* Додавання (add)
* Віднімання (sub)
* Множення (mul)
* Ділення (div)

Введення чисел та операцій за допомогою аргументів командного рядка.

Результат виводиться у консоль.

Обробляє помилки, наприклад, ділення на нуль, некоректні аргументи.

## Встановлення

Пакет виокнується безпосередньо через **npx**, без необхідності його глобального встановлення.

## Використання

```shell
npx sigma-lessons add 2 3
# prints: 
You're trying to add with 2 and 3
Calculation result is:  5

npx sigma-lessons div 3 0
# throws an error:
Error: Cannot divide by zero 
```

