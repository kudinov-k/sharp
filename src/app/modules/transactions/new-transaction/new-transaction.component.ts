import { Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { CustomValidators } from 'ngx-custom-validators'
import { ToastrService } from 'ngx-toastr'
import { plainToClass } from '../../../core/class-transformer'
import { BaseComponent } from '../../../core/component'
import { RequestObject } from '../../../misc/request'
import { Transaction } from '../../../models/transaction'
import { User } from '../../../models/user'
import { AuthService } from '../../../services/auth.service'
import { TransactionService } from '../../../services/transaction.service'
import { UserService } from '../../../services/user.service'

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.scss']
})
export class NewTransactionComponent extends BaseComponent implements OnInit {

  transactionForm: FormGroup

  currentUser: User.Model | null

  transaction: Transaction.Model

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private location: Location,
              private transactionService: TransactionService) {
    super()
  }

  userObserver = (r: RequestObject) => this.userService.getAll(r)

  ngOnInit(): void {
    const state: any = this.location.getState()
    if (state['transaction']) {
      this.transaction = plainToClass(Transaction.Model, state['transaction'], {excludeExtraneousValues: true})
    }

    this.subs.add(
      this.authService.currentUser.subscribe(
        user => {
          if (user) {
            this.currentUser = user
            this.initForm()
          }
        }
      )
    )
  }

  save() {
    this.submitted = true
    if (!this.transactionForm.valid) {
      return
    }
    this.processed = true

    const body = this.transactionForm.value
    body.amount = body.amount.toString().replace(',', '.')

    this.subs.add(
      this.transactionService.addTransaction(body).subscribe(
        ignore => {
          this.toastrService.success('Transaction Successful')
          if (this.transaction) {
            this.transaction = undefined
          }
          this.userService.getMe()
          this.submitted = false
          this.transactionForm.reset({name: null, amount: null})
        },
        error => {
          console.log(error)
        },
        () => this.processed = false
      )
    )
  }

  private initForm() {
    this.transactionForm = this.formBuilder.group(
      {
        name: [this.transaction ? this.transaction.username : null, Validators.required],
        amount: [
          this.transaction ? Math.abs(this.transaction.amount) : null,
          [
            Validators.required,
            CustomValidators.number,
            CustomValidators.lte(this.currentUser.balance),
            CustomValidators.gt(0)
          ]
        ],
      }
    )
  }

}
