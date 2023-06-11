from django import forms


class PhotoForm(forms.Form):
    template_name = "photo_form.html"
    photo = forms.ImageField(label="Photo", required=False)
    created = forms.DateField(label="Created", required=False)

  
