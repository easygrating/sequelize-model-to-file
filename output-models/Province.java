public class Province  {
	private int id;
	private String name;
	private String code;
	private double latitude;
	private double longitude;
	private java.util.Date createdAt;
	private java.util.Date updatedAt;
	List<Municipalities> municipalities = new LinkedList();
	private Municipalities municipalities;
}