import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAds, Ad} from '../api/ads';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardMedia, Typography, Pagination } from '@mui/material';

const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<Ad[]>([])
  const limit = 5;
  useEffect(() => {
    getAds()
  }, [])

  const getAds = async () => {
    const templData = await fetchAds({})
    setData(templData.data)
    console.log(templData)
    return templData
  }

//   const { data, isLoading, error } = useQuery(
//     ['ads', { search, category: categoryFilter, page }],
//     () => fetchAds({ search, category: categoryFilter, page, limit }),
//     // { keepPreviousData: true }
//   );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(e.target.value as string);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div>Hello world</div>
  )
};
 /*

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки объявлений</div>;

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" color="primary" onClick={() => navigate('/form')}>
          Разместить объявление
        </Button>
        <Box display="flex" gap={2}>
          <TextField label="Поиск по названию" value={search} onChange={handleSearchChange} />
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="category-filter-label">Категория</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="Категория"
            >
              <MenuItem value="">Все</MenuItem>
              <MenuItem value="Недвижимость">Недвижимость</MenuItem>
              <MenuItem value="Авто">Авто</MenuItem>
              <MenuItem value="Услуги">Услуги</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {data && data.data.length === 0 ? (
        <Typography>Нет объявлений</Typography>
      ) : (
        data?.data.map((ad: Ad) => (
          <Card key={ad.id} sx={{ display: 'flex', mb: 2, cursor: 'pointer' }} onClick={() => navigate(`/item/${ad.id}`)}>
            {ad.photo ? (
              <CardMedia component="img" sx={{ width: 151 }} image={ad.photo} alt={ad.title} />
            ) : (
              <Box sx={{ width: 151, backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Нет фото</Typography>
              </Box>
            )}
            <CardContent>
              <Typography variant="h6">{ad.title}</Typography>
              <Typography variant="body2" color="text.secondary">{ad.location}</Typography>
              <Typography variant="body2" color="text.secondary">{ad.category}</Typography>
              <Button variant="outlined" onClick={(e) => { e.stopPropagation(); navigate(`/item/${ad.id}`); }}>
                Открыть
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {data && (
        <Pagination
          count={Math.ceil(data.total / limit)}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};*/

export default ListPage;

/*
fetch

*/
