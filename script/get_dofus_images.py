import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os
from concurrent.futures import ThreadPoolExecutor
import mimetypes

def download_image(url, save_dir, filename=None):
    """
    Download an image from a URL and save it to the specified directory.
    
    Args:
        url (str): URL of the image
        save_dir (str): Directory to save the image
        filename (str, optional): Custom filename for the image
    
    Returns:
        bool: True if download successful, False otherwise
    """
    try:
        response = requests.get(url, stream=True)
        if response.status_code != 200:
            print(f"Failed to download {url}")
            return False

        # Determine file extension from content-type
        content_type = response.headers.get('content-type', '')
        ext = mimetypes.guess_extension(content_type) or '.jpg'
        
        # Generate filename if not provided
        if not filename:
            filename = os.path.basename(urlparse(url).path)
            if not filename:
                filename = f"image_{hash(url)}{ext}"
            elif not os.path.splitext(filename)[1]:
                filename = f"{filename}{ext}"

        filepath = os.path.join(save_dir, filename)
        
        # Save the image
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        
        print(f"Downloaded: {filename}")
        return True
    
    except Exception as e:
        print(f"Error downloading {url}: {str(e)}")
        return False

def fetch_images(url, save_dir="downloaded_images", max_workers=5):
    """
    Fetch all images from a website and download them.
    
    Args:
        url (str): Website URL to scrape images from
        save_dir (str): Directory to save downloaded images
        max_workers (int): Maximum number of concurrent downloads
    
    Returns:
        tuple: (total_images, successful_downloads)
    """
    try:
        # Create save directory if it doesn't exist
        os.makedirs(save_dir, exist_ok=True)
        
        # Fetch and parse the webpage
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all image tags
        img_tags = soup.find_all('img')
        image_urls = []
        
        # Extract image URLs and convert to absolute URLs
        for img in img_tags:
            img_url = img.get('src') or img.get('data-src')
            if img_url:
                img_url = urljoin(url, img_url)
                image_urls.append(img_url)
        
        total_images = len(image_urls)
        print(f"Found {total_images} images")
        
        # Download images concurrently
        successful_downloads = 0
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            results = executor.map(
                lambda url: download_image(url, save_dir),
                image_urls
            )
            successful_downloads = sum(1 for result in results if result)
        
        print(f"\nDownload complete!")
        print(f"Successfully downloaded: {successful_downloads}/{total_images} images")
        print(f"Images saved in: {os.path.abspath(save_dir)}")
        
        return total_images, successful_downloads
    
    except Exception as e:
        print(f"Error fetching images: {str(e)}")
        return 0, 0

if __name__ == "__main__":
    # Example usage
    website_url = "https://eternum-docs.realms.world/mechanics/resources/resources"  # Replace with your target website
    fetch_images(website_url)