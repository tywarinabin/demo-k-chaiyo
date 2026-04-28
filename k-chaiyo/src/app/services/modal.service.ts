import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  open() {
    this.isOpenSubject.next(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpenSubject.next(false);
    document.body.style.overflow = '';
  }
}
