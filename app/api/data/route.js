import { NextResponse } from 'next/server';
import { JSONFilePreset } from "lowdb/node"; // https://github.com/typicode/lowdb
import seed from './all-charity-data.json';
// import seed from './montreal-2022.json';
// import seed from './peterborough-2022.json';

const db = await JSONFilePreset('db.json', seed);

export async function GET(req) {
    const query = req.nextUrl.searchParams.get('query') || '';
    const filters = JSON.parse(req.nextUrl.searchParams.get('filters') || '{}');
    const {
        city,
        province,
        area,
        category,
        subcategory,
        sortValue,
        page = 1,
        limit = 100000,
    } = filters;
    const { charities } = db.data;

    console.log('got the query', query, filters);

    let filteredCharities = [];

    if (Object.keys(filters).length === 0) {
        console.log('No filters provided');
        filteredCharities = charities;
    } else {
        filteredCharities = charities.filter(charity => {
            return (city ? charity.city.toLowerCase() === city.toLowerCase() : true) &&
                   (province ? charity.province.toLowerCase() === province.toLowerCase() : true) &&
                   (area ? charity.descriptionEnglish.toLowerCase() === area.toLowerCase() : true) &&
                   (category ? charity.categoryEnglish.toLowerCase() === category.toLowerCase() : true) &&
                   (subcategory ? charity.subcategoryEnglish.toLowerCase() === subcategory.toLowerCase() : true);
        });
    }

    filteredCharities = filteredCharities.filter(charity => {
        return charity.bn.includes(query) ||
               charity.legalName.toLowerCase().includes(query.toLowerCase()) ||
               charity.legalNameRaw.toLowerCase().includes(query.toLowerCase()) ||
               charity.accountName.toLowerCase().includes(query.toLowerCase()) ||
               charity.description.toLowerCase().includes(query.toLowerCase());
    });

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCharities = filteredCharities.slice(startIndex, endIndex);

    return NextResponse.json({
        total: filteredCharities.length,
        page,
        limit,
        results: paginatedCharities,
        totalPages: Math.ceil(filteredCharities.length / limit),
        totalResults: filteredCharities.length
    });
}

