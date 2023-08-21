import json

from factory import LazyFunction
from factory.django import DjangoModelFactory
from faker import Faker
from faker.providers import file, misc, date_time

from photos.models import Photo, PhotoPositions

faker = Faker()
faker.add_provider(file)
faker.add_provider(misc)
faker.add_provider(date_time)

STATUS = [x[0] for x in Photo.STATUS_PHOTO]


class PhotoFactory(DjangoModelFactory):
    uuid = LazyFunction(lambda: faker.uuid4())
    photo = LazyFunction(lambda: faker.file_path(depth=3, extension="jpg"))
    column_id = LazyFunction(lambda: faker.random_int(min=0, max=3))
    order = LazyFunction(lambda: faker.random_int())
    status = LazyFunction(lambda: faker.random_choices(elements=STATUS))
    created_date = LazyFunction(lambda: faker.date_time())

    class Meta:
        model = Photo


class PhotoPositionsFactory(DjangoModelFactory):
    columns = LazyFunction(
        lambda: {
            "1": json.dumps([PhotoFactory.build() for _ in range(faker.random_int())]),
            "2": json.dumps([PhotoFactory.build() for _ in range(faker.random_int())]),
            "3": json.dumps([PhotoFactory.build() for _ in range(faker.random_int())]),
        }
    )

    class Meta:
        model = PhotoPositions
