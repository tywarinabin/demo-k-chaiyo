import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../services/modal.service';

interface ConfettiPiece {
  x: string;
  color: string;
  delay: string;
  rotation: string;
}

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
  confettiPieces: ConfettiPiece[] = [];

  close() {
    this.modalService.close();
    this.submitted = false;
    this.formData = { name: '', email: '', phone: '', message: '' };
    this.errors = {};
    this.confettiPieces = [];
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
      this.generateConfetti();
      this.submitted = true;
    }
  }

  private generateConfetti(): void {
    const colors = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'];
    this.confettiPieces = Array.from({ length: 40 }, () => ({
      x: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: `${Math.random() * 0.6}s`,
      rotation: `${Math.random() * 360}deg`
    }));
  }
}
