import { Container, Filters, ProductsGroupList, Title, TopBar } from '@/components/shared';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      <TopBar />

      <Container className="mt-10 pb-16">
        <div className="flex gap-[80px]">
          {/* Фильтрация */}
          <div className="w-[250px]">
            <Suspense fallback={<div>Загрузка фильтров...</div>}>
              <Filters />
            </Suspense>
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {/*пиц*/}
              <ProductsGroupList
                title="Пиццы"
                items={[
                  {
                    id: 1,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 2,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 3,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 4,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 5,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 6,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 7,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 8,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                ]}
                categoryId={1}
              />
              {/*  зав*/}
              <ProductsGroupList
                title="Комбо"
                items={[
                  {
                    id: 1,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 2,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 3,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 4,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 5,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 6,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 7,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                  {
                    id: 8,
                    name: 'Чесночный цыпленок',
                    imageUrl:
                      'https://media.dodostatic.net/image/r:584x584/0198bf24170179679a7872f2ddf16d18.avif',
                    price: 550,
                    items: [{ price: 500 }],
                  },
                ]}
                categoryId={2}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
