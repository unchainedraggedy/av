import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAdById, Ad } from '../api/ads';
import { Box, Button, Typography, Card, CardMedia, CardContent } from '@mui/material';

const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <div>Некорректный идентификатор объявления</div>;
  }

  const { data, status, error } = useQuery<Ad, Error, Ad, [string, string]>({
    queryKey: ['ad', id],
    queryFn: () => fetchAdById(Number(id)),
    enabled: !!id,
  });

  if (status === 'pending') return <div>Загрузка...</div>;
  if (status === 'error' || !data) return <div>Ошибка загрузки объявления</div>;

  return (
    <Box p={2}>
      <Card>
        {data.photo && (
          <CardMedia component="img" height="300" image={data.photo} alt={data.title} />
        )}
        <CardContent>
          <Typography variant="h4">{data.title}</Typography>
          <Typography variant="subtitle1">{data.location}</Typography>
          <Typography variant="body1">{data.description}</Typography>
          <Typography variant="body2">Категория: {data.category}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate('/form', { state: { ad: data } })}
          >
            Редактировать объявление
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ItemPage;
