import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenWordsValidator(forbiddenWords: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const value = control.value.toLowerCase();
    const foundWord = forbiddenWords.find(word => value.includes(word.toLowerCase()));
    
    return foundWord ? { forbiddenWords: { matched: foundWord } } : null;
  };
}
