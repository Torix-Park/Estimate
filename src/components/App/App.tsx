import React, { useEffect, useState } from 'react';
import styles from './App.module.scss';
import FakeJson from '../../FakeJSON.json';
import { getImagePath } from '../../utils/utils';

type Product = {
  uuid: string;
  productName: string;
  standard: string;
  brand: string;
  country: string;
  price: string;
  pieces: number;
  size: string;
  image?: string; // Optional field
};

type EstimateItem = Product & { quantity: number };

const App: React.FC = () => {
  const [productList] = useState<Product[]>(FakeJson);
  const [estimateList, setEstimateList] = useState<EstimateItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [showImages, setShowImages] = useState<boolean>(true);
  const [showDownloadButtons, setShowDownloadButtons] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // darkmode 체크
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    setIsDarkMode(savedMode === 'true');

    const handleStorageChange = () => {
      const updatedMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(updatedMode);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 견적표에 물건 추가
  const addToEstimate = (product: Product) => {
    setEstimateList((prev) => {
      // 이미 견적표에 물건이 있는지 찾고 있으면 수량만 추가 , 없으면 새로 추가
      const existingItem = prev.find((item) => item.uuid === product.uuid);
      if (existingItem) {
        return prev.map((item) =>
          item.uuid === product.uuid ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 견적표에 물건 삭제
  const removeFromEstimate = (uuid: string) => {
    setEstimateList((prev) => prev.filter((item) => item.uuid !== uuid));
  };

  // 견적표 물건 수량 수정
  const updateQuantity = (uuid: string, quantity: number) => {
    setEstimateList((prev) =>
      prev.map((item) => (item.uuid === uuid ? { ...item, quantity } : item)),
    );
  };

  // 금액에 콤마 추가
  const formatNumberWithCommas = (number: Number | string) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 견적표 물건 총합
  const calculateTotal = () => {
    return formatNumberWithCommas(
      estimateList.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
    );
  };

  // 미리보기
  const previewAlert = () => {};

  // 견적표 다운로드
  const fileDownload = () => {};

  // 사진 미리보기 토글
  const toggleImagePreview = () => {
    setShowImages((prev) => !prev);
  };

  // 정렬 및 검색 초기화
  const resetFilters = () => {
    setSearchCategory('all');
    setSearchQuery('');
    setSortOrder(null); // 정렬 상태 초기화
    setCurrentPage(1);
    setItemsPerPage(20);
  };

  // 단가 정렬 (asc,desc,null)
  const handleSortByPrice = () => {
    setSortOrder((prevSortOrder) => {
      if (prevSortOrder === null) return 'asc';
      if (prevSortOrder === 'asc') return 'desc';
      return null;
    });
  };

  // 검색된 데이터들
  const filteredProducts = productList.filter((product) => {
    if (searchCategory === 'all') {
      // 특정 필드만 전체 검색 (상품명, 규격, 브랜드, 원산지)
      return ['productName', 'standard', 'brand', 'country'].some((key) =>
        (product[key as keyof Product] as string).toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      // 선택된 카테고리에서 검색
      const value = product[searchCategory as keyof Product];
      return typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  // 검색된 데이터들의 갯수
  const filteredTotalPages =
    itemsPerPage === 0 ? 1 : Math.ceil(filteredProducts.length / itemsPerPage);

  // 검색된 데이터의 정렬된 데이터들
  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sortOrder === 'asc') {
      return parseFloat(a.price) - parseFloat(b.price);
    } else if (sortOrder === 'desc') {
      return parseFloat(b.price) - parseFloat(a.price);
    }
    return 0;
  });

  // 화면에 보여주는 데이터들
  const displayedProducts =
    itemsPerPage === 0
      ? sortedProducts
      : sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 페이징네이션 앞 뒤 버튼
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= filteredTotalPages) setCurrentPage(page);
  };

  // 페이지당 갯수 선택
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // 검색 카테고리 선택
  const handleSearchCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchCategory(e.target.value);
  };

  // 검색 입력력
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className={`${styles.container} ${isDarkMode ? styles.darkmode : ''}`}>
      <div className={styles.product_container}>
        <div className={styles.product_controls}>
          <label>
            <select value={searchCategory} onChange={handleSearchCategoryChange}>
              <option value='all'>전체</option>
              <option value='productName'>상품명</option>
              <option value='standard'>규격</option>
              <option value='brand'>브랜드</option>
              <option value='country'>원산지</option>
            </select>
          </label>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder='검색 내용 입력'
          />
          <span>사진 미리보기</span>
          <label className={styles.preview_image_switch}>
            <input type='checkbox' checked={showImages} onChange={toggleImagePreview} />
            <span className={styles.slider} />
          </label>
          <label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={20}>20개</option>
              <option value={50}>50개</option>
              <option value={0}>제한 없음</option>
            </select>
          </label>
          <button className={styles.reset_button} onClick={resetFilters}>
            초기화
          </button>
        </div>
        <div className={styles.products}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>상품명</th>
                <th>규격</th>
                <th>브랜드</th>
                <th>원산지</th>
                <th
                  style={{ color: 'red', cursor: 'pointer' }}
                  onClick={handleSortByPrice}
                  id='price'
                >
                  단가
                  {sortOrder === 'asc' ? '🔼' : sortOrder === 'desc' ? '🔽' : ''}
                  <br />
                  (VAT 별도)
                </th>
                <th>갯수</th>
                <th>사이즈</th>
                <th>사진</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product, idx) => (
                <tr key={product.uuid}>
                  <td style={{ textAlign: 'center' }}>
                    {idx + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.standard}</td>
                  <td>{product.brand}</td>
                  <td>{product.country}</td>
                  <td>
                    {formatNumberWithCommas(product.price)}원
                    <br />(
                    {formatNumberWithCommas(
                      Math.round(Number(product.price) + Number(product.price) / 10),
                    )}
                    )
                  </td>
                  <td>{product.pieces}EA</td>
                  <td>{product.size}</td>
                  <td className={styles.img}>
                    {showImages && product.image ? (
                      <a
                        href={`${process.env.PUBLIC_URL}/images/${product.image}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <img
                          alt={product.standard}
                          src={`${process.env.PUBLIC_URL}/images/${product.image}`}
                        />
                      </a>
                    ) : (
                      product.image && (
                        <button
                          onClick={() => {
                            window.open(`${process.env.PUBLIC_URL}/images/${product.image}`);
                          }}
                        >
                          미리보기
                        </button>
                      )
                    )}
                  </td>
                  <td>
                    <button onClick={() => addToEstimate(product)}>추가</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button
            onClick={() => {
              handlePageChange(currentPage - 1);
            }}
          >
            &lt;
          </button>
          {Array.from({ length: filteredTotalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={currentPage === page ? 'active' : ''}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => {
              handlePageChange(currentPage + 1);
            }}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className={styles.estimate_container}>
        <h2 className={styles.header}>견적 단가표</h2>
        <div className={styles.estimate}>
          <table>
            <colgroup>
              <col width='35%' />
              <col width='10%' />
              <col width='20%' />
              <col width='20%' />
              <col width='20%' />
            </colgroup>
            <thead>
              <tr>
                <th>상품명</th>
                <th>단가</th>
                <th>수량</th>
                <th>합계</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {estimateList.map((item) => (
                <tr key={item.uuid}>
                  <td>{item.productName}</td>
                  <td>{formatNumberWithCommas(item.price)}원</td>
                  <td className={styles.custom_number_input}>
                    <input
                      type='text'
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value.replace(/\D/g, '');
                        const newValue = inputValue.replace(/^0+/, '');
                        updateQuantity(item.uuid, Number(newValue));
                      }}
                    />
                  </td>
                  <td className={styles.price_quantity}>
                    {formatNumberWithCommas(Number(item.price) * item.quantity)}원
                  </td>
                  <td>
                    <button onClick={() => removeFromEstimate(item.uuid)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.estimate_controls}>
          <span className={styles.total}>총 합계 : {calculateTotal()}원</span>
          <button className={styles.preview_button} onClick={previewAlert}>
            미리보기
          </button>
          <div className={styles.download_container}>
            <button className={styles.download_button}>
              <img src={getImagePath('btn_icon_download')} alt='다운로드' />
              <span>다운로드 ⇧</span>
            </button>
            <div className={styles.download_buttons}>
              <button>
                <img src={getImagePath('btn_icon_image')} alt='이미지' />
                <span>이미지</span>
              </button>
              <button>
                <img src={getImagePath('btn_icon_excel')} alt='엑셀' />
                <span>엑셀</span>
              </button>
              <button>
                <img src={getImagePath('btn_icon_pdf')} alt='PDF' />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
