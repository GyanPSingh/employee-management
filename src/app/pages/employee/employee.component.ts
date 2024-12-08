import { Component, inject, OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import {
  IApiResponse,
  IChildDept,
  IParentDept,
} from '../../model/interface/master';

import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Employee } from '../../model/class/Employee';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
})
export class EmployeeComponent implements OnInit {
  isFormVisible = signal<Boolean>(false);
  masterSrv = inject(MasterService);
  parentDept = signal<IParentDept[]>([]);
  childDept = signal<IChildDept[]>([]);
  parentDeptId: number = 0;
  childDeptId: number = 0;
  employeeObj: Employee = new Employee();
  employeeList: Employee[] = [];
  childDeptList = signal<IChildDept[]>([]);
  isLoader = signal<boolean>(true);
  isApiCallInProgress = signal<boolean>(false);
  ngOnInit(): void {
    this.getParentDept();
    this.getEmployees();
  }

  getParentDept() {
    this.masterSrv.getAllDept().subscribe((res: IApiResponse) => {
      this.parentDept.set(res.data);
    });
  }

  getChildDeptbyIdDept() {
    this.masterSrv
      .getChildDeptbyIdDept(this.parentDeptId)
      .subscribe((res: IApiResponse) => {
        this.childDept.set(res.data);
      });
  }

  getEmployees() {
    this.masterSrv.getAllEmp().subscribe((res: Employee[]) => {
      this.isLoader.set(false);
      return (this.employeeList = res);
    });
  }

  onParentDeptChange() {
    const childDpet = this.masterSrv
      .getChildDeptbyIdDept(this.parentDeptId)
      .subscribe((Res: IApiResponse) => {
        this.childDeptList.set(Res.data);
      });
  }

  onSave() {
    debugger;
    if (this.isApiCallInProgress() == false) {
      this.isApiCallInProgress.set(true);
      this.masterSrv.saveEmp(this.employeeObj).subscribe(
        (res: IApiResponse) => {
          this.getEmployees();
          this.isApiCallInProgress.set(false);
          this.employeeObj = new Employee();
          alert('Employee ceated');
        },
        (error) => {
          alert('API error');
          this.isApiCallInProgress.set(false);
        }
      );
    }
  }

  onEdit(data: Employee) {
    this.employeeObj = data;
    this.isFormVisible.set(true);
  }
  onUpdate() {
    debugger;
    this.masterSrv.updateEmp(this.employeeObj).subscribe(
      (res: IApiResponse) => {
        this.getEmployees();
        this.employeeObj = new Employee();
        alert('Employee updated');
      },
      (error) => {
        alert('API error');
      }
    );
  }
  onDelete(id: number) {
    const isDelete = confirm('Are you sure want to Delete');
    if (isDelete) {
      this.masterSrv.deleteEmpByid(id).subscribe(
        (res: IApiResponse) => {
          this.getEmployees();
          alert('Employee deleted');
        },
        (error) => {
          alert('API error');
        }
      );
    }
  }
}
