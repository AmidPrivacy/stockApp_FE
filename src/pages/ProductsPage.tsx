import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Breadcrumb, message, Tag } from 'antd'; 
import AddProduct from '../components/products/AddProduct';
import AddCompany from '../components/products/AddSeller'; 
import List from '../components/products/List';
import { fetchProductList } from '../api/products';
import AddImage from '../components/products/AddImage';
  

const Products: React.FC = () => {
  
  const [products, setProducts] = useState([]);   
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ addVisible: false, imgVisible: false, id: null, firmVisible: false });      
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1, total: 0, });
  const [search, setSearch]=useState({
    id: "",
    name: "",   
    price: "",  
  });


  // Component didMount - call products
  useEffect(() => { getProducts(); setPagination({ pageSize: 10, current: 1, total: 0, }) }, [search]);

  // Fetch products
  function getProducts(page: any = pagination) {
    setLoading(true);
    fetchProductList(page, search).then((res:any)=>{ 
      const allDatas = res.data.data.map((item:any)=> ({ ...item, companies: [] }));
      setProducts(allDatas);  
      setPagination(prev=> ({ ...prev, total: (res.data.meta.last_page*10) }))
      setLoading(false);
    }).catch((_err:any) => {
      setLoading(false);
      message.error("Sistem xətası");
    });
  }
   
  // Pagination event
  function handleTableChange(page: any) {  
    setPagination(page);
    getProducts(page)
  };


  function codeGenerate (xDate: Date) {
    const newCode =  xDate.getFullYear().toString(10).substring(2)
        + (xDate.getMonth()+1).toString(10).padStart(2,'0')
        + xDate.getDate().toString(10).padStart(2,'0')
        + xDate.getHours().toString(10).padStart(2,'0')
        + xDate.getMinutes().toString(10).padStart(2,'0')  
        + xDate.getSeconds().toString(10).padStart(2,'0')

    setCode(newCode);
  }
  

  return (<div style={{ marginTop: "10px" }}> 
    <Row>

      {/************* Top of table ***********/}
      <Col span={7} offset={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/">Ana səhifə</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item> Məhsullar </Breadcrumb.Item>
        </Breadcrumb>
      </Col>

      <Col span={2} offset={9}>
        {code.length>0 ? <Tag color="cyan" closable onClose={(_e) => setCode("")}>{code}</Tag> : null}
      </Col>
      <Col span={1} offset={1}>
        {sessionStorage.getItem("role")==="admin" ?
        <Button type="primary" style={{ paddingRight: "15px" }} 
            onClick={()=>codeGenerate(new Date())} key="code-generate">
            Kod generate
        </Button> : null}
      </Col> 

      <Col span={1} offset={1}>
        {sessionStorage.getItem("role")==="admin" ?
        <Button type="primary" style={{ paddingRight: "15px" }}  
          onClick={() => setSettings((prev)=>({ ...prev, addVisible: true })) } key="new-price">
            +Yeni
        </Button> : null}
      </Col> 
    </Row>
    {/* <FilterByFields search={search} setSearch={setSearch} /> */}
    <Row>
      {/************* Table row ***********/}
      <Col span={22} offset={1} style={{ marginTop: "10px" }}> 
        <List products={products??[]} setSettings={setSettings} handleTableChange={handleTableChange} 
          pagination={pagination} loading={loading} getProducts={getProducts} />
      </Col>
    </Row>

    {sessionStorage.getItem("role")==="admin" ?
      <AddProduct settings={settings} setSettings={setSettings} getProducts={getProducts} /> :null}
   
    <AddImage resetRow={()=>setSettings({ addVisible: false, imgVisible: false, id: null, firmVisible: false })} 
       settings={settings} />
    {sessionStorage.getItem("role")==="admin" ?
      <AddCompany resetRow={()=>setSettings({ addVisible: false, imgVisible: false, id: null, firmVisible: false })} 
        fetchDatas={getProducts} settings={settings} /> : null}
 
  </div>);
}

export default Products;