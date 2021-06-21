import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  fileToUpload: File;
  kittyImagePreview: string | ArrayBuffer;

  contactForm: FormGroup;
  destroy$: Subject<null> = new Subject();

  selectedFile: ImageSnippet;
  constructor(private usersService: UsersService, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: [''],
      lastName: [''],
      email: [''],
      foto: [null, []],
    });
  }
  ngOnInit(): void {
    this.contactForm
      .get('foto')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        console.log('VALALALALAL', value);

        this.handleFileChange(value.files);
      });
  }
  processFile(imageInput: any) {
    const file: File = imageInput.target.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      console.log('selectedFile', this.selectedFile.file);
    });

    reader.readAsDataURL(file);
  }
  handleFileChange([kittyImage]) {
    this.fileToUpload = kittyImage;
    console.log('fileToUpload', this.fileToUpload);

    const reader = new FileReader();
    reader.onload = (loadEvent) =>
      (this.kittyImagePreview = loadEvent.target.result);
    console.log(this.kittyImagePreview);

    reader.readAsDataURL(kittyImage);
  }
  async addContact() {
    const mediaFolderPath = 'media/tricardo003@gmail.com/';
    const { name, email, lastName } = this.contactForm.value;
    const { downloadUrl$, uploadProgress$ } =
      await this.usersService.uploadFileAndGetMetadata(
        mediaFolderPath,
        this.fileToUpload
      );

    downloadUrl$.subscribe(async (val) => {
      const contact = {
        name,
        email,
        lastName,
        imagen: val,
      };
      await this.usersService.addEmployee(contact);
      this.contactForm.reset();
    });
  }
}
