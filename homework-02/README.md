# Програма для генерації та аналізу текстового файлу в Node.js

Програм виконує дві основні функції:

* Генерація текстового файлу заданого розміру (у bytes), що містить випадковий набір визначених речень (речення
  зазначені у файлі
  sentences.txt)
* Підрахунок кількості слів у заданому текстовому файлі файлі.

Результат виводиться у консоль.

## Використання

```shell
# Generate
# homework-04 - path to the sentences file
# 1073741824 - (1Gb) required final file size in bytes 
npm run generate homework-04 1073741824

# prints: 
The file with requested size 1073741824 has been generated: /Users/yevgenchabanyuk/Documents/Projects/sigma-lessons/homework-04/result.txt
Spent time: 00:25:46

# Count words
# homework-04 - path to the result file
npm run count homework-04
# prints:
Words count in the result file is:  173880032
```

