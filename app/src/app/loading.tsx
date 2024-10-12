import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Header from './ui/header'

export default function Loading() {
  return (
    <>
      <Header />
      <main className="flex flex-col m-8 md:m-16 gap-8">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative">
          {[1, 2].map((i) => (
            <Card key={i} className="w-full max-w-sm mx-auto">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[1px] w-full my-4" />
        <section className="flex flex-col justify-center">
          <Skeleton className="h-8 w-[200px] mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </section>
        <Skeleton className="h-[1px] w-full my-4" />
        <section className="mb-12 flex flex-col justify-center">
          <Skeleton className="h-8 w-[150px] mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
