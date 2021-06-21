import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  employees: Observable<any[]>;
  private employeesCollection: AngularFirestoreCollection<any>;

  constructor(
    private readonly afs: AngularFirestore,
    private readonly storage: AngularFireStorage
  ) {
    this.employeesCollection = afs.collection<any>('employees');
  }
  getEmployees(): Observable<any[]> {
    return this.afs.collection('employees').valueChanges();
  }

  async addEmployee(employee: any) {
    const id = this.afs.createId();
    const data = { id, ...employee };
    console.log('data', data);
    await this.employeesCollection.add(data);
  }

  uploadFileAndGetMetadata(mediaFolderPath: string, fileToUpload: File) {
    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(
      filePath,
      fileToUpload
    );
    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };
  }
  private getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL())
    );
  }
}
