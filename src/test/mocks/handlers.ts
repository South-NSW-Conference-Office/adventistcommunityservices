import { http, HttpResponse } from 'msw'

// The real API URL depends on env. Use `*` host matching so tests don't break
// when VITE_API_URL changes between machines.
const CHURCHES_PUBLIC = '*/api/churches/public'
const CHURCH_PUBLIC_BY_ID = '*/api/churches/public/:id'

export const handlers = [
  http.get(CHURCHES_PUBLIC, () =>
    HttpResponse.json({
      success: true,
      message: 'Churches retrieved',
      data: [
        {
          _id: 'church1',
          name: 'Mock Church 1',
          hierarchyPath: 'union1/conf1/church1',
          isActive: true,
        },
        {
          _id: 'church2',
          name: 'Mock Church 2',
          hierarchyPath: 'union1/conf1/church2',
          isActive: true,
        },
      ],
      count: 2,
    })
  ),

  http.get(CHURCH_PUBLIC_BY_ID, ({ params }) =>
    HttpResponse.json({
      success: true,
      data: {
        _id: params.id,
        name: `Mock Church ${params.id}`,
        hierarchyPath: `union1/conf1/${params.id}`,
        isActive: true,
      },
    })
  ),
]
