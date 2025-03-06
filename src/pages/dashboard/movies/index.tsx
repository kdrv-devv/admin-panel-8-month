import { useEffect, useState } from "react";
import { Modal, Space, Table, Tag, Popconfirm } from "antd";
import { useAxios } from "../../../hooks/useAxios";
import notifications from "../../../notifications";
import type { TableProps } from "antd";
import { MovieTicketData } from "../../../@types";



const Movies = () => {
  const [moviesData, setMoviesData] = useState<MovieTicketData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const axios = useAxios();

  // Ma'lumotlarni yuklash funksiyasi
  const fetchMovies = () => {
    setLoading(true);
    axios({
      url: "/admin/get-movies",
      method: "GET",
    })
      .then((response) => {
        const data = response.data?.data || [];
        
        // Ma'lumotlarni TableProps uchun moslashtirish (har birida key bo'lishi kerak)
        const formattedData = data.map((movie: MovieTicketData, index: number) => ({
          ...movie,
          key: movie._id || `movie-${index}` // Agarda backend ID bermasa, index qo'shiladi
        }));
        
        setMoviesData(formattedData);
      })
      .catch(() => {
        notifications("err-fetch-movies");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Table ustunlarini sozlash
  const columns: TableProps<MovieTicketData>["columns"] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img className="w-[50px] h-[50px] object-cover" src={text} alt="Movie Poster" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Age Restriction",
      dataIndex: "ageRestriction",
      key: "ageRestriction",
      render: (text) => <span>{text}+</span>,
    },
    {
      title: "Available Date",
      dataIndex: "availableDate",
      key: "availableDate",
    },
    {
      title: "Available Time",
      dataIndex: "availableTime",
      key: "availableTime",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Format",
      dataIndex: "format",
      key: "format",
    },
    {
      title: "Hall Number",
      dataIndex: "hallNumber",
      key: "hallNumber",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Target Audience",
      dataIndex: "targetAudience",
      key: "targetAudience",
    },
    {
      title: "Genres",
      dataIndex: "genre",
      key: "genre",
      render: (genres) => (
        <>
          {Array.isArray(genres) ? genres.map((genre) => (
            <Tag color="blue" key={genre}>
              {genre}
            </Tag>
          )) : null}
        </>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true, // Matn juda uzun bo'lsa qisqartirib ko'rsatadi
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <button  className="bg-green-600 text-[10px] text-white h-[20px] w-[40px] rounded-md" onClick={() => handleEdit(record)}>Edit</button>
          <Popconfirm
            title="Kinoni o'chirish"
            description="Haqiqatan ham bu kinoni o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <button className="bg-red-600 text-[10px] text-white h-[20px] w-[40px] rounded-md">Delete</button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Modal oynalari uchun state
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<MovieTicketData>({
    title: "",
    ageRestriction: 0,
    image: "",
    targetAudience: "",
    genre: [""],
    availableDate: "",
    availableTime: "",
    format: "",
    price: 0,
    hallNumber: 0,
    director: "",
    duration: 0,
    country: "",
    year: 2024,
    description: "",
  });

  // Form o'zgarishlarini boshqarish
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "genre" ? value.split(",") : value,
    }));
  };

  // Yangi kino qo'shish yoki mavjud kinoni yangilash
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ma'lumotlar qaytib kelishi uchun body yaratish
    const requestData = { ...formData };
    
    // Edit rejimida bo'lsa, update API ga yuborish
    if (isEditMode && currentId) {
      axios({
        url: `/admin/edit-movie/${currentId}`,
        method: "PATCH",
        body: { ...requestData, id: currentId },
      })
        .then(() => {
          setOpen(false);
          notifications("update-movie");
          fetchMovies();
          resetForm();
        })
        .catch(() => {
          notifications("err-update-movie");
        });
    } else {
      // Yangi kino qo'shish
      axios({
        url: "/admin/add-movie",
        method: "POST",
        body: requestData,
      })
        .then(() => {
          setOpen(false);
          notifications("add-movie");
          fetchMovies(); 
          resetForm();
        })
        .catch((error) => {
          console.error("Error adding movie:", error);
          notifications("err-add-movie");
        });
    }
  };



  
  // Form ni boshlang'ich holatga qaytarish
  const resetForm = () => {
    setFormData({
      title: "",
      ageRestriction: 0,
      image: "",
      targetAudience: "",
      genre: [""],
      availableDate: "",
      availableTime: "",
      format: "",
      price: 0,
      hallNumber: 0,
      director: "",
      duration: 0,
      country: "",
      year: 2024,
      description: "",
    });
    setIsEditMode(false);
    setCurrentId(undefined);
  };

  // Modal ochish uchun
  const openAddModal = () => {
    resetForm();
    setOpen(true);
  };

  // Kinoni tahrirlash
  const handleEdit = (record: MovieTicketData) => {
    
    // Mavjud kinoning ma'lumotlarini formga joylash
    setFormData({
      title: record.title,
      ageRestriction: record.ageRestriction,
      image: record.image,
      targetAudience: record.targetAudience,
      genre: record.genre || [""],
      availableDate: record.availableDate,
      availableTime: record.availableTime,
      format: record.format,
      price: record.price,
      hallNumber: record.hallNumber,
      director: record.director,
      duration: record.duration,
      country: record.country,
      year: record.year,
      description: record.description,
    });
    
    // Tahrirlash rejimi va ID ni o'rnatish
    setIsEditMode(true);
    setCurrentId(record._id);
    
    // Modal ni ochish
    setOpen(true);
  };

  // Kinoni o'chirish
  const handleDelete = (record: MovieTicketData) => {
    
    // API orqali kinoni o'chirish
    axios({
      url: `/admin/delete-movie/${record?._id}`,
      method: "DELETE"
    })
      .then(() => {
        notifications("delete-movie");
        fetchMovies(); // Yangilangan ma'lumotlarni yuklash
      })
      .catch((error) => {
        console.error("Error deleting movie:", error);
        notifications("err-delete-movie");
      });
  };

  // Modal yopilayotganda
  const handleModalCancel = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <section className="movies w-full p-2">
      <div className="dashboard-header pb-2 border-b border-[#1677ff] w-full flex items-center justify-between">
        <h3 className="font-bold text-[27px] text-[#1677ff]">Movies List</h3>
        <button
          onClick={openAddModal}
          className="bg-[#1677ff] h-[44px] w-[199px] flex items-center justify-center text-white text-[19px]"
        >
          ADD NEW MOVIE
        </button>
      </div>
      
      {/* Kino qo'shish/tahrirlash modali */}
      <Modal
        title={isEditMode ? "EDIT MOVIE" : "ADD MOVIE"}
        centered
        className="!w-[60%]"
        open={open}
        footer={false}
        onOk={handleModalCancel}
        onCancel={handleModalCancel}
      >
        <div className="w-full mx-auto p-6 bg-[#f0f4ff] rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#1677ff] mb-6 text-center">
            {isEditMode ? "Kino Ma'lumotlarini Tahrirlash" : "Kino Chipta Ma'lumotlarini Kiritish"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="text-sm mb-1 text-gray-600">
                  kino nomi
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Kino nomi"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="ageRestriction"
                  className="text-sm mb-1 text-gray-600"
                >
                  yoshga chegara
                </label>
                <input
                  id="ageRestriction"
                  type="number"
                  name="ageRestriction"
                  value={formData.ageRestriction}
                  onChange={handleChange}
                  placeholder="Yoshga chegara"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="image" className="text-sm mb-1 text-gray-600">
                  kino rasmi url
                </label>
                <input
                  id="image"
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Kino rasmi URL"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="targetAudience"
                  className="text-sm mb-1 text-gray-600"
                >
                  kimlar uchun
                </label>
                <input
                  id="targetAudience"
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Kimlar uchun"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="genre" className="text-sm mb-1 text-gray-600">
                  janrlar
                </label>
                <input
                  id="genre"
                  type="text"
                  name="genre"
                  value={formData.genre.join(",")}
                  onChange={handleChange}
                  placeholder="Janrlar (vergul bilan ajrating)"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="availableDate"
                  className="text-sm mb-1 text-gray-600"
                >
                  seans sanasi
                </label>
                <input
                  id="availableDate"
                  type="date"
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleChange}
                  placeholder="Seans sanasi"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="availableTime"
                  className="text-sm mb-1 text-gray-600"
                >
                  seans vaqti
                </label>
                <input
                  id="availableTime"
                  type="time"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleChange}
                  placeholder="Seans vaqti"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="format" className="text-sm mb-1 text-gray-600">
                  format
                </label>
                <input
                  id="format"
                  type="text"
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  placeholder="Format (2D, 3D)"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm mb-1 text-gray-600">
                  chipta narxi
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Chipta narxi"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="hallNumber"
                  className="text-sm mb-1 text-gray-600"
                >
                  zal raqami
                </label>
                <input
                  id="hallNumber"
                  type="number"
                  name="hallNumber"
                  value={formData.hallNumber}
                  onChange={handleChange}
                  placeholder="Zal raqami"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="director"
                  className="text-sm mb-1 text-gray-600"
                >
                  rejissyor
                </label>
                <input
                  id="director"
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Rejissyor"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="duration"
                  className="text-sm mb-1 text-gray-600"
                >
                  kino davomiyligi
                </label>
                <input
                  id="duration"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Kino davomiyligi (daqiqa)"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="country" className="text-sm mb-1 text-gray-600">
                  ishlab chiqarish mamlakati
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Ishlab chiqarish mamlakati"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="year" className="text-sm mb-1 text-gray-600">
                  ishlab chiqarilgan yil
                </label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Ishlab chiqarilgan yil"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label
                  htmlFor="description"
                  className="text-sm mb-1 text-gray-600"
                >
                  kino haqida qisqacha ma'lumot
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Kino haqida qisqacha ma'lumot"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1677ff]"
                  rows={4}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#1677ff] text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? "KINONI YANGILASH" : "KINONI QO'SHISH"}
            </button>
          </form>
        </div>
      </Modal>

      {/* Kinolar jadvali */}
      <div className="list mt-4">
        <Table 
          columns={columns} 
          dataSource={moviesData} 
          loading={loading}
          rowKey="key"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </section>
  );
};

export default Movies;