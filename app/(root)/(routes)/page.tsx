import { SearchInput } from '@/components/search-input';
import { UserButton } from '@clerk/nextjs';
import React from 'react'
import prismadb from '@/lib/prismadb';
import { Categories } from '@/components/categories';
import { Companions } from '@/components/companions';

interface RootPageProps{
  searchParams:{
    categoryId:string;
    name:string;
  }
}

const RootPage = async ({
  searchParams
}:RootPageProps) => {

  const data=await prismadb.companion.findMany({
    where:{
      categoryId:searchParams.categoryId,
      name:{
        search:searchParams.name
      },
    },
    orderBy:{
        createdAt:"desc"
    },
    include:{
      _count:{
        select:{
          messages:true
        }
      }
    }

  })


  const categories=await prismadb.category.findMany();
  return (
    <div className='h-full p-4 space-y-2'>
       <SearchInput/>
       <Categories data={categories}/>
       <Companions data={data}/>
    </div>
  )
}

export default RootPage;