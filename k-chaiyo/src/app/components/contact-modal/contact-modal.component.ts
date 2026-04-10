import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-contact-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.scss'
})
export class ContactModalComponent {
  modalService = inject(ModalService);
  isOpen$ = this.modalService.isOpen$;

  formData = { name: '', email: '', phone: '', message: '' };
  submitted = false;
  errors: Record<string, string> = {};

  close() {
    this.modalService.close();
    this.submitted = false;
    this.formData = { name: '', email: '', phone: '', message: '' };
    this.errors = {};
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }

  validate(): boolean {
    this.errors = {};
    if (!this.formData.name.trim()) this.errors['name'] = 'Name is required';
    if (!this.formData.email.trim()) this.errors['email'] = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) this.errors['email'] = 'Enter a valid email';
    return Object.keys(this.errors).length === 0;
  }

  onSubmit() {
    if (this.validate()) {
      this.submitted = true;
    }
  }
}
