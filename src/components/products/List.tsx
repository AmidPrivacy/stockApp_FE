import React, { useState } from 'react'; 
import { LightgalleryItem } from "react-lightgallery"; 
import { Button, Table, Popconfirm, message, Tag } from 'antd'; 
import { EditOutlined, PrinterOutlined, DeleteOutlined  } from '@ant-design/icons'; 
import { deleteProduct, detachSellerToProduct, DublicateProduct } from '../../api/products';
import FormData from 'form-data';  
import OrderProduct from './OrderProduct';
import PrintBarcode from './PrintBarcode';

const { Column } = Table;   
 


const List: React.FC<{ products: any, pagination:any, setSettings: Function, handleTableChange: Function, loading: any, setPivot: Function,
        getProducts: Function }> = ({ products, setSettings, pagination, handleTableChange, loading, getProducts, setPivot }) => {
 
  
  const [order, setOrder] = useState({ 
    pivotId: null, 
    isModalVisible: false,
    pivotPrice: "", 
    seller: "",
    orderPrice: "", 
    count: "", 
    pivotDesc: "", 
    description: "" 
  });

  const [printObj, setPrintObj] = useState({
    isModalVisible: false,
    id: 0,
    productName: "",
    barcode: "",
    price: ""
  })


  function handleDelete(id: any): void {

    const formData = new FormData();
    formData.append('_method', "DELETE")
    deleteProduct(formData, id).then(_res=>{
      message.success("Məhsul silindi");
      getProducts();
    })

  }

  function handleCopy(id:number) {
    DublicateProduct(id).then((res: any) => {
      if (res !== undefined) { 
        getProducts(); 
        message.success("Məhsulun dublikatı yaradıldı"); 
      } 
    }).catch((_err:any) => { 
      message.error("Sistem xətası");
    }); 
  }
 
  const deleteSeller =(sellerId: number, productId: number) => {
    const form = new FormData();
    form.append('seller_id', sellerId); 
    form.append('_method', "PUT"); 
    detachSellerToProduct(form, productId).then(_res=>{
      if(_res !== undefined) {
        message.success("Məhsul silindi");
        getProducts();
      }
    })
  }

  return (<>
  <Table dataSource={products} rowKey={(record: any) => record.id} onChange={(e)=>handleTableChange(e)} loading={loading}
    className='product-table'  pagination={pagination} locale={{ emptyText: "Məlumat tapılmadı" }}>

  
    <Column title="Id" dataIndex="id" key="id" /> 
    <Column title="Məhsul"  dataIndex="name" key="name" /> 
    <Column title="Barkod"  dataIndex="barcode" key="barcode" /> 
    
    <Column title="Şəkil" 
      render={(rec) => {
        return <>
          {rec.image !==null ? <LightgalleryItem src={rec.image.url}><img src={rec.image.url} alt='' style={{ width: "60px", display: "block" }} /></LightgalleryItem>  : null}
          {sessionStorage.getItem("role")==="admin" ? <Button onClick={() => {  
            setSettings((prevState:any) => ({ ...prevState,  imgVisible: true, id: rec.id })); 
          }}>Ətraflı</Button> : null}
        </>
      }} key="picture" /> 

      <Column title="Firmalar" 
        render={(rec) => { 
          return <> 
          <div key={rec.id}>
            {rec.sellers.map((res:any) => 
            <div key={res.id}>
              
              <Tag key={res.id} onClick={() =>
              setOrder((prevState:any) => ({ ...prevState,  isModalVisible: true, pivotPrice: res.pivot.price,
                      pivotId: res.pivot.id, pivotDesc: res.pivot.description, seller: res.name }))}>
              {res.name} - <b>{res.pivot.price+"AZN"}</b>
              </Tag>

              {sessionStorage.getItem("role")==="admin" ? 
                <>
                  <EditOutlined style={{ cursor: "pointer" }} key={res.pivot.id} onClick={()=> { 
                    setSettings((prevState:any) => ({ ...prevState,  firmVisible: true, id: rec.id })); 
                    setPivot({ id: res.id, price: res.pivot.price, description: res.pivot.description })  } } />
                    <Popconfirm placement="top" title="Firmanı ayırmaq istəyirsinizmi?" 
                        onConfirm={()=>deleteSeller(res.id, rec.id)} okText="Bəli" cancelText="Xeyr">
                      <DeleteOutlined style={{ cursor: "pointer", marginLeft: "13px" }} />
                    </Popconfirm>
                </> : null}

                

              <PrinterOutlined  style={{ cursor: "pointer", marginLeft: "13px" }} key={res.id+"a"+res.pivot.id}
                onClick={()=>{ setPrintObj({ isModalVisible: true, productName: rec.name, id: rec.id,
                                barcode: res.pivot.barcode, price: res.pivot.price }) }}/> 
            </div>
            )} 
          </div>
          {sessionStorage.getItem("role")==="admin" ? <Button style={{ marginTop: "10px" }} onClick={() => {  
              setSettings((prevState:any) => ({ ...prevState,  firmVisible: true, id: rec.id })); 
            }}>Əlavə et</Button> : null}
            </>
        }} key="company" />
  
    {sessionStorage.getItem("role")==="admin" ?
      <Column title="" key="Actions" width={300} render={(rec) => <>
        <Popconfirm placement="top" title="Məhsulu silmək istəyirsinizmi?" 
          onConfirm={() =>handleDelete(rec.id)} okText="Bəli" cancelText="Xeyr">
            <Button> Sil </Button>
        </Popconfirm>
        <Popconfirm placement="top" title="Məhsulu kopyalamaq istəyirsinizmi?" 
          onConfirm={() =>handleCopy(rec.id)} okText="Bəli" cancelText="Xeyr">
            <Button style={{ margin: "5px" }}> Kopyala </Button>
        </Popconfirm>
        <Button key={rec.id} 
          onClick={()=>setSettings((prev:any)=>({ ...prev, addVisible: true, id: rec.id }))}> Düzəliş et </Button>
      </>} /> : null}

  </Table> 
  <OrderProduct order={order} setOrder={setOrder} />

  <PrintBarcode data={printObj} setData={setPrintObj} />
</>);
}

export default List;