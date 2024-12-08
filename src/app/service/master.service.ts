import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiResponse } from '../model/interface/master';
import { Employee } from '../model/class/Employee';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiUrl: string = 'https://projectapi.gerasim.in/api/EmployeeManagement/';

  constructor(private http: HttpClient) {}

  getAllDept(): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(this.apiUrl + 'GetParentDepartment');
  }

  getChildDeptbyIdDept(deptid: number): Observable<IApiResponse> {
    return this.http.get<IApiResponse>(
      `${this.apiUrl}GetChildDepartmentByParentId?deptid=${deptid}`
    );
  }

  saveEmp(obj: Employee): Observable<IApiResponse> {
    return this.http.post<IApiResponse>(this.apiUrl + 'CreateEmployee', obj);
  }
  getAllEmp(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl + 'GetAllEmployees');
  }

  updateEmp(obj: Employee): Observable<IApiResponse> {
    return this.http.put<IApiResponse>(
      this.apiUrl + 'UpdateEmployee/' + obj.employeeId,
      obj
    );
  }
  deleteEmpByid(id: number): Observable<IApiResponse> {
    return this.http.delete<IApiResponse>(this.apiUrl + 'DeleteEmployee/' + id);
  }
}
