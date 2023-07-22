from django.contrib import admin

from history.models import HistoryModel


class HistoryAdmin(admin.ModelAdmin):
    date_hierarchy = "created_date"
    list_display = ["uuid_object", "previous_state", "current_state"]



# Register your models here.
admin.site.register(HistoryModel, HistoryAdmin)

