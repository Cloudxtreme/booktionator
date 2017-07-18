import { Component, ViewChild } from '@angular/core';
import { PasswordToggleComponent } from 'app/shared/components/password-toggle/password-toggle.component';
import { NgForm } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { AuthService } from 'app/shared/services/auth.service';
import { Email } from "types/email";
import { PostalCode } from "types/postalcode";
import { Phone } from "types/phone";
import { LoaderService } from 'app/shared/services/loader.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../child.component.scss']
})
export class RegisterComponent {
  @ViewChild(PasswordToggleComponent)
  toggler: PasswordToggleComponent;

  @ViewChild(NgForm)
  form: NgForm;

  name: string;
  email: string;
  password: string;
  postalcode: string;
  phone: string;

  errors: { [input: string]: string };

  private service: AuthService;
  private snackbar: MdSnackBar;
  private loader: LoaderService;

  constructor(service: AuthService, snackbar: MdSnackBar, loaderService: LoaderService) {
    this.service = service;
    this.snackbar = snackbar;
    this.loader = loaderService;

    this.errors = {};
  }

  register(): void {
    if (!this.validate()) return;

    this.loader.update(true);

    let email = new Email(this.email);
    let postalcode = new PostalCode(this.postalcode);
    let phone = new Phone(this.phone);

    let self = this;
    this.service.register(this.name, email, this.password, postalcode, phone).then(function registered() {
      self.loader.update(false);

      self.reset();
      self.snackbar.open('Successfully registered! Please confirm your email', undefined, {
        duration: 2000
      });
    }, function error(error) {
      self.loader.update(false);

      self.snackbar.open(error.message, undefined, {
        duration: 2000
      });
    });
  }

  private validate(): boolean {
    this.errors = {};
    let name = this.name !== '';
    let email = Email.validate(this.email);
    let password = this.password.length > 6;
    let postalcode = PostalCode.validate(this.postalcode);
    let phone = Phone.validate(this.phone);

    if (!email) {
      this.errors['email'] = 'Invalid format';
    }

    if (!password) {
      this.errors['password'] = 'Must have at least 6 characters';
    }

    if (!postalcode) {
      this.errors['postalcode'] = 'Invalid format';
    }

    if (!phone) {
      this.errors['phone'] = 'Invalid format';
    }

    return name && email && password && postalcode && phone;
  }

  private reset(): void {
    this.form.resetForm();
  }
}
